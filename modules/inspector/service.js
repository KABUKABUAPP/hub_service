const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
  issueJwt,
  encryptPassword,
  hashPassword,
  comparePassword,
  axiosRequestFunction,
  verificationCode,
  jwtForOtp,
  formatPhoneNumber,
  imageUploader,
  verifyJwt
} = require("../../helpers");
const {
  HTTP_OK,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
} = require("../../helpers/httpCodes");
const {
  Inspector,
  InspectionDetails,
  Hub,
  OneTimePassword
} = require('../../models')
const _ = require("lodash");
const axios = require('axios')

const { sendQueue } = require("../../queues");
const {
  getRedisData,
  saveRedisData,
  deleteRedisData,
  deleteRedisMany,
} = require("../../helpers/cache");
const config_env = require("../../config_env");
const { messaging } = require("../../helpers/constants");
const { updateHubInspections } = require("../hub/service");
const { genOtp, validateOTP } = require("../otp/service");
//const { sendQueue } = require('../queues/index');

exports.login = async (payload) => {
  try {
    const {
      inspector,
      password
    } = payload
    let message, otp
    const isPasswordCorrect = await comparePassword(inspector.password, password)

    if (!isPasswordCorrect) {
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: `Wrong Password Inputed`,
      };
    }
    if (inspector.regCompleted === false) {
      message = 'Proceed to create password with OTP sent to your phone'
      //Send OTP TO PHone NUmber
      const sendOTP = await genOtp({
        user_id: inspector._id,
        phone_number: inspector.phone_number
      })
      otp = sendOTP.data
    } else {
      message = 'Login Successful'
    }
    const token = issueJwt(inspector)
    const loggedInInspector = await Inspector.findByIdAndUpdate(inspector._id,
      { access_token: token }, { new: true })
    const cars_processed = await InspectionDetails.find({ inspector: loggedInInspector?._id }).countDocuments()
    const cars_approved = await InspectionDetails.find({ inspector: loggedInInspector?._id, status: "approved" }).countDocuments()
    const cars_declined = await InspectionDetails.find({ inspector: loggedInInspector?._id, status: "declined" }).countDocuments()
    loggedInInspector.cars_processed = cars_processed
    loggedInInspector.cars_approved = cars_approved
    loggedInInspector.cars_declined = cars_declined
    loggedInInspector.save()
    return {
      status: "success",
      code: HTTP_OK,
      message: message,
      data: {
        inspector: loggedInInspector,
        token,
        otp
      }
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};

exports.createPassword = async (payload) => {
  try {
    const {
      inspector,
      password,
      otp
    } = payload

    const verifyOTP = await validateOTP({
      user_id: inspector._id,
      otp: otp
    })
    if (verifyOTP.status === "error") {
      return verifyOTP
    }

    if (Boolean(inspector.regCompleted) === true) {
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "Password Already Created, use forgot password link if you cannot remember your password"
      }
    }
    //VAlidate OTP


    const hashed = await hashPassword(password)
    await Inspector.findByIdAndUpdate(inspector._id, {
      password: hashed,
      regCompleted: true
    })
    const passwordedInspector = await Inspector.findById(inspector._id)

    return {
      status: "success",
      code: HTTP_OK,
      message: 'Password created Successfully',
      data: passwordedInspector
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};

exports.viewProfile = async (payload) => {
  try {
    const {
      user
    } = payload

    const cars_processed = await InspectionDetails.find({ inspector: user?._id }).countDocuments()
    const cars_approved = await InspectionDetails.find({ inspector: user?._id, status: "approved" }).countDocuments()
    const cars_declined = await InspectionDetails.find({ inspector: user?._id, status: "declined" }).countDocuments()
    user.cars_processed = cars_processed
    user.cars_approved = cars_approved
    user.cars_declined = cars_declined
    user.save()

    return {
      status: "success",
      code: HTTP_OK,
      message: 'Inspector Profile Fetched Successfully',
      data: user
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};

exports.updateProfilePicture = async (payload) => {
  try {
    const {
      inspector,
      picture
    } = payload
    const imgUrl = picture ? await imageUploader(picture?.path) : undefined
    const updatedInspector = await Inspector.findByIdAndUpdate(inspector?._id, {
      profile_image: imgUrl
    }, { new: true })

    return {
      status: "success",
      code: HTTP_OK,
      message: 'Inspector Profile Image Updated Successfully',
      data: updatedInspector
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};


exports.updatePassword = async (payload) => {
  try {
    const {
      inspector,
      password,
      newPassword
    } = payload

    const isPasswordCorrect = await comparePassword(inspector.password, password)

    if (password === newPassword) {
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: `Current Password And New Password The Same`,
      };
    }

    if (!isPasswordCorrect) {
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: `Current Password Incorrect`,
      };
    }

    const hashed = await hashPassword(newPassword)
    const updated = await Inspector.findByIdAndUpdate(inspector._id, {
      password: hashed,
      regCompleted: true
    }, { new: true })

    return {
      status: "success",
      code: HTTP_OK,
      message: `Password Updated Successfully`
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};

exports.forgotPassword = async (payload) => {
  try {
    const {
      phone_number,
    } = payload

    const formatted = formatPhoneNumber(phone_number)
    const exisingInspector = await Inspector.findOne({ phone_number: formatted })

    if (!exisingInspector) {
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: `No Account Registered With This Phone Number`,
      };
    }

    const sendOTP = await genOtp({
      user_id: exisingInspector._id,
      phone_number: exisingInspector.phone_number
    })
    const otp = sendOTP.data

    return {
      status: "success",
      code: HTTP_OK,
      message: `OTP Sent To ${formatted} successfully`,
      data: {
        inspector: exisingInspector,
        otp
      }
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};

exports.resetPassword = async (payload) => {
  try {
    const {
      inspector,
      new_password,
      otp
    } = payload

    const verifyOTP = await validateOTP({
      user_id: inspector._id,
      otp: otp
    })
    if (verifyOTP.status === "error") {
      return verifyOTP
    }

    const hashed = await hashPassword(new_password)
    const updated = await Inspector.findByIdAndUpdate(inspector._id, {
      password: hashed,
      regCompleted: true
    }, { new: true })


    return {
      status: "success",
      code: HTTP_OK,
      message: `Log In Successful`,
      data: updated
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};

exports.fetchDriverByCode = async (payload) => {
  try {
    const {
      code
    } = payload

    const axiosResponse = await axios.get(
      `${config_env.RIDE_SERVICE_BASE_URL}/driver/inspection_code`,
      { params: { inspection_code: code } }
    ).catch(function (error) {
      if (error.response) {
        return {
          status: error.response.data.status,
          code: error.response.status,
          message: error.response.data.message,
        }
      } else if (error.request) {
        console.log("AXIOS ERROR REQUEST>>>>", error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    });


    let driver_details
    if (Number(axiosResponse.status) < 400) {
      driver_details = axiosResponse.data.data
    } else {
      return {
        status: axiosResponse.status,
        code: axiosResponse.code,
        message: axiosResponse.message
      }
    }

    return {
      status: "status",
      code: HTTP_OK,
      message: "Driver Details Retrieved Successfully",
      data: driver_details
    }

  } catch (error) {
    // console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message,
      data: error,
    };
  }
};

exports.approveDeclineDriverApplication = async (payload) => {
  try {
    const {
      inspector,
      driver_id,
      hub_id,
      approval_status,
      reason
    } = payload
    let message,
      hubUpdate,
      finalAxiosReq,
      no_of_cars_processed,
      no_of_cars_approved,
      no_of_cars_declined

    if (String(approval_status).toLowerCase() === "active") {
      message = "Driver Application Approved Successfully"
      // const axiosReq = await axiosRequestFunction({
      //   method: "get",
      //   url: `${config_env.RIDE_SERVICE_BASE_URL}/driver/verify-driver-approval/${driver_id}`
      // })
      // if(axiosReq.status !== "success"){
      //   return {
      //     status: "error",
      //     code: axiosReq.code,
      //     message: axiosReq.message
      //   }
      // }
      console.log("INSPECTOR??????", inspector);
      const axiosToAuth = await axiosRequestFunction({
        method: "put",
        url: `${config_env.RIDE_SERVICE_BASE_URL}/driver/complete-driver-onboarding/${driver_id}`,
        data: {
          approval_status: approval_status,
          reason: reason,
          inspector_id: inspector._id,
          assigned_hub_id: inspector?.assigned_hub,
        }
      })
      if (axiosToAuth.status !== "success") {
        return {
          status: "error",
          code: axiosToAuth.code,
          message: axiosToAuth.message
        }
      }
      const inspected = await InspectionDetails.findOne({ inspector: inspector._id, driver: driver_id, hub: inspector?.assigned_hub })
      if (inspected) {
        await InspectionDetails.findByIdAndUpdate(inspected?._id, {
          status: "approved",
        }, { new: true })
        no_of_cars_processed = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, }).countDocuments();
        no_of_cars_approved = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, status: "approved" }).countDocuments();

      } else {
        await InspectionDetails.create({
          driver: driver_id,
          status: "approved",
          inspector: inspector?._id,
          hub: inspector?.assigned_hub
        })
        no_of_cars_processed = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, }).countDocuments();
        no_of_cars_approved = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, status: "approved" }).countDocuments();

      }
      const afterInspector = await Inspector.findByIdAndUpdate(inspector?._id, {
        cars_processed: no_of_cars_processed,
        cars_approved: no_of_cars_approved
      }, { new: true })
      hubUpdate = {
        hub_id: afterInspector.assigned_hub,
        driver_id: driver_id,
        status: "approved"
      }
      //update hub center
      await updateHubInspections(hubUpdate)
      finalAxiosReq = axiosToAuth

    } else {
      message = 'Driver Application Declned Successfully'
      const axiosToAuth = await axiosRequestFunction({
        method: "put",
        url: `${config_env.RIDE_SERVICE_BASE_URL}/driver/complete-driver-onboarding/${driver_id}`,
        data: {
          approval_status: approval_status,
          reason: reason,
          inspector_id: inspector._id
        }
      })
      if (axiosToAuth.status !== "success") {
        return {
          status: "error",
          code: axiosToAuth.code,
          message: axiosToAuth.message
        }
      }
      const inspected = await InspectionDetails.findOne({ inspector: inspector._id, driver: driver_id, hub: inspector?.assigned_hub })
      if (inspected) {
        await InspectionDetails.findByIdAndUpdate(inspected?._id, {
          status: "declined",
        }, { new: true })
        no_of_cars_processed = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, }).countDocuments();
        no_of_cars_declined = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, status: "declined" }).countDocuments();
      } else {
        await InspectionDetails.create({
          driver: driver_id,
          status: "declined",
          inspector: inspector?._id,
          hub: inspector?.assigned_hub
        })
        no_of_cars_processed = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, }).countDocuments();
        no_of_cars_declined = await InspectionDetails.find({ inspector: inspector._id, driver: driver_id, status: "approved" }).countDocuments();

      }
      const afterInspector = await Inspector.findByIdAndUpdate(inspector?._id, {
        cars_processed: no_of_cars_processed,
        cars_declined: no_of_cars_declined
      }, { new: true })
      hubUpdate = {
        hub_id: afterInspector.assigned_hub,
        driver_id: driver_id,
        status: "declined"
      }
      await updateHubInspections(hubUpdate)
      finalAxiosReq = axiosToAuth

    }

    //Complete Driver Onboarding
    console.log("TOTAL_CARS_PROCESSED>>>>", no_of_cars_processed);
    console.log("TOTAL_CARS_APPROVED>>>>", no_of_cars_approved);
    console.log("TOTAL_CARS_DECLINED>>>>", no_of_cars_declined);
    return {
      status: finalAxiosReq?.status,
      code: finalAxiosReq?.code,
      message: finalAxiosReq?.message,
      data: finalAxiosReq?.data
    }
  } catch (error) {
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};




exports.syncLocationTrackerFromHub = async (payload) => {
  try {
    const {
      inspection_code,
      device_number
    } = payload



    const axiosReq = await axiosRequestFunction({
      method: "put",
      url: `${config_env.RIDE_SERVICE_BASE_URL}/car/sync-location-tracker/from-hub`,
      data: { inspection_code, device_number }
    })
    if (axiosReq.status !== "success") {
      return {
        status: "error",
        code: axiosReq.code,
        message: axiosReq.message
      }

    } else {

      return {
        status: "success",
        code: axiosReq?.code,
        message: axiosReq?.message,
        data: axiosReq?.data
      }
    }
  } catch (error) {
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};

exports.syncCameraFromHub = async (payload) => {
  try {
    const {
      inspection_code,
      device_number
    } = payload


    const axiosReq = await axiosRequestFunction({
      method: "put",
      url: `${config_env.RIDE_SERVICE_BASE_URL}/car/sync-camera/from-hub`,
      data: { inspection_code, device_number }
    })
    if (axiosReq.status !== "success") {
      return {
        status: "error",
        code: axiosReq.code,
        message: axiosReq.message
      }

    } else {

      return {
        status: "success",
        code: axiosReq?.code,
        message: axiosReq?.message,
        data: axiosReq?.data
      }
    }
  } catch (error) {
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};


exports.approveDriverApplicationQuick = async (payload) => {
  try {
    const {
      inspector,
      inspection_code,
    } = payload
    const fetch_id = await this.fetchDriverByCode({ code: inspection_code })
    const approve = await this.approveDeclineDriverApplication({
      inspector,
      driver_id: fetch_id?.data?.driver._id,
      approval_status: "active"
    })


    if (approve.status !== "success") {
      return {
        status: "error",
        code: approve.code,
        message: approve.message
      }
    }
    else {
      return {
        status: "success",
        code: approve?.code,
        message: approve?.message,
        data: approve?.data
      }
    }
    //  


  } catch (error) {
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};

exports.fetchAssignedApplications = async (payload) => {
  try {
    const {
      user,
      limit,
      page,
      approval_status,
      date,
      driver_name
    } = payload
    const pendingApplications = await axiosRequestFunction({
      url: config_env.RIDE_SERVICE_BASE_URL + `/driver/fetch-assigned-applications`,
      method: "get",
      params: { limit, page, approval_status: approval_status, date: date, driver_name, inspector_id: String(user._id), assigned_hub_id: String(user?.assigned_hub) },
      headers: { hubid: user._id }
    })

    return pendingApplications
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}

exports.viewADriver = async (payload) => {
  try {
    const {
      user,
      driver_id
    } = payload
    const pendingApplications = await axiosRequestFunction({
      url: config_env.RIDE_SERVICE_BASE_URL + `/driver/view-driver-from-hub/${driver_id}`,
      method: "get",
      headers: { hubid: user._id }
    })

    return pendingApplications
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}
exports.inspectorsHubsCars = async ({ inspector_id, hub_id, limit, page }) => {
  try {
    const cars_processed_by_inspector = await InspectionDetails.find({ inspector: inspector_id }).countDocuments()
    const cars_approved_by_inspector = await InspectionDetails.find({ inspector: inspector_id, status: "approved" }).countDocuments()
    const cars_declined_by_inspector = await InspectionDetails.find({ inspector: inspector_id, status: "declined" }).countDocuments()
    const cars_processed_in_hub = await InspectionDetails.find({ hub: hub_id }).countDocuments()
    const cars_approved_in_hub = await InspectionDetails.find({ hub: hub_id, status: "approved" }).countDocuments()
    const cars_declined_in_hub = await InspectionDetails.find({ hub: hub_id, status: "declined" }).countDocuments()
    // const driver_ids = await InspectionDetails.find({
    //   $or: [
    //     {hub: hub_id},
    //     {inspector: inspector_id}
    //   ]}
    // ).distinct("driver")
    // const carHistories = await axiosRequestFunction({
    //   method: "post",
    //   url: config_env.RIDE_SERVICE_BASE_URL + '/admin/car/inspection-history',
    //   data: {
    //     limit,
    //     page,
    //     driver_ids
    //   }
    // })
    const data = {
      cars_processed_by_inspector,
      cars_approved_by_inspector,
      cars_declined_by_inspector,
      cars_processed_in_hub,
      cars_approved_in_hub,
      cars_declined_in_hub,
      // driver_histories: carHistories.data
    }

    return {
      status: "success",
      code: HTTP_OK,
      message: "inspected car data retreived successfully",
      data
    }


  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}

exports.validateToken = async (payload) => {
  try {
    const {
      token
    } = payload
    const { id } = verifyJwt(token)
    const inspector = id ? await Inspector.findById(id) : undefined
    if (inspector) {
      return {
        status: "success",
        code: HTTP_OK,
        message: `inspector Retreived successfully`,
        data: inspector
      };
    } else {
      return {
        status: "error",
        code: HTTP_UNAUTHORIZED,
        message: 'Unathourized Access'
      }
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}

exports.getAssignedSharpCars = async (payload) => {
  try {
    const {
      inspector,
      status,
      limit,
      page
    } = payload
    const axiosResponse = await axiosRequestFunction({
      method: "get",
      url: `${config_env.RIDE_SERVICE_BASE_URL}/car/get-sharp-cars-from-hub-service`,
      params: {
        status: status,
        inspector_id: String(inspector?._id),
        hub_id: String(inspector?.assigned_hub),
        limit: limit ? limit : "10",
        page: page ? page : "1"
      }
    })
    return axiosResponse

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}

exports.markCarsAsDelivered = async (payload) => {
  try {
    const {
      inspector,
      delivery_id
    } = payload
    const axiosResponse = await axiosRequestFunction({
      method: "put",
      url: `${config_env.RIDE_SERVICE_BASE_URL}/car/mark-cars-as-delivered/${delivery_id}`,
      params: {
        inspector_id: String(inspector?.id),
        hub_id: inspector?.assigned_hub,
      }
    })
    return axiosResponse

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}

exports.fetchCarsFromCarOwnersForInspection = async (payload) => {
  try {
    const {
      user,
      limit,
      page,
      inspection_status
    } = payload
    const hub_id = String(user?.assigned_hub)
    const pendingApplications = await axiosRequestFunction({
      url: config_env.RIDE_SERVICE_BASE_URL + `/sharp/get-sharp-cars-assigned-to-a-hub/${hub_id}`,
      method: "get",
      params: {
        limit,
        page,
        inspection_status
      }
    })

    return pendingApplications
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}

exports.inspectSharpPrivateCar = async (payload) => {
  try {
    const {
      id,
      status,
      remarks,
    } = payload
    const inspectACarResponse = await axiosRequestFunction({
      url: config_env.RIDE_SERVICE_BASE_URL + `/sharp/inspect-sharp-private/${id}`,
      method: "put",
      params: {
        status,
        remarks,
      }
    })

    return inspectACarResponse
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
}