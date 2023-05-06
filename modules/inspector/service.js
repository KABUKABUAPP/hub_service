const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
  issueJwt,
  encryptPassword,
  hashPassword,
  comparePassword,
  axiosRequestFunction
} = require("../../helpers");
const {
  HTTP_OK,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../helpers/httpCodes");
const {
  Inspector,
  Hub
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
//const { sendQueue } = require('../queues/index');

exports.enterPhoneOrEmail = async (payload) => {
  try {
    const  {
      email_or_number,
    } = payload

    const inspector = await Inspector.findOne({
      $or: [
        {phone_number: email_or_number},
        {email: email_or_number}
      ]
    });
    const message = String(email_or_number).includes('@')?"No Account Found with this email": "No Account Found with this Phone Number"
   
    if(!inspector){
      return {
        status: "error",
        code: HTTP_NOT_FOUND,
        message: message
      }
    }
    const token = issueJwt(inspector)
    return {
      status: "success",
      code: HTTP_OK,
      message: 'Proceed to create password',
      data: {inspector, token}
      // data: inspector
    }

  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.createPassword = async (payload) => {
  try {
    const  {
      inspector,
      password,
    } = payload

    if(Boolean(inspector.regCompleted) === true){
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "Password Already Created, use forgot password link if you cannot remember your password"
      }

    }

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
    return false;
  }
};


exports.login = async (payload) => {
  try {
    const  {
      phone_number,
      password,
    } = payload

   const existingInspector = await Inspector.findOne({phone_number: phone_number})
  
   if(!existingInspector){
    return {
      status: "error",
      code: HTTP_NOT_FOUND,
      message: "Phone Number not registered on this platform"
    }
   }

   const passwordMatch = await comparePassword(existingInspector.password, password) 
   if(!passwordMatch){
    return {
      status: "error",
      code: HTTP_BAD_REQUEST,
      message: "Incorrect Password"
    }
   }

   const token = issueJwt(existingInspector)

   await Inspector.findByIdAndUpdate(existingInspector._id, {
    access_token: token
   })

    return {
      status: "success",
      code: HTTP_OK,
      message: 'Log In Successful',
      data: {inspector: existingInspector, access_token: token }
    }

  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.fetchDriverByCode = async (payload) => {
  try {
    const  {
      code
    } = payload

   const axiosResponse = await axios.get(
      `${config_env.AUTH_SERVICE_BASE_URL}/driver/inspection_code`,
      {params: {inspection_code: code}}
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
   if(Number(axiosResponse.status) < 400){
    driver_details = axiosResponse.data.data
   } else  {
    return {
      status:axiosResponse.status,
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
    const  {
      inspector,
      driver_id,
      hub_id,
      approval_status,
      reason
    } = payload
    let message
    let hubUpdate 

  if(String(approval_status).toLowerCase() === "active"){
    message = "Driver Application Approved Successfully"
    const axiosReq = await axiosRequestFunction({
      method: "get",
      url: `${config_env.AUTH_SERVICE_BASE_URL}/driver/verify-driver-approval/${driver_id}`
    })
    if(axiosReq.status !== "success"){
      return {
        status: "error",
        code: axiosReq.code,
        message: axiosReq.message
      }
    }
    // await Inspector.findByIdAndUpdate(inspector._id, 
    //   { $inc : 
    //     { 
    //       "cars_processed" : 1, 
    //       "cars_approved" : 1, 
    //     } 
    //   }
    // )
    // hubUpdate = {
    //   hub_id: inspector.assigned_hub,
    //   status: "approved"
    // }
    // //update hub center
    // await updateHubInspections(hubUpdate)


  } else {
    message = 'Driver Application Declned Successfully'
    // await Inspector.findByIdAndUpdate(inspector._id, 
    //   { $inc : 
    //     { 
    //       "cars_processed" : 1, 
    //       "cars_declined" : 1, 
    //     } 
    //   }
    // )
    // hubUpdate = {
    //   hub_id: inspector.assigned_hub,
    //   status: "declined"
    // }
    // await updateHubInspections(hubUpdate)
  }
  //   const axiosResponse = await axios.put(
  //     `${config_env.RIDE_SERVICE_BASE_URL}/driver/approve-decline-driver-application`,
  //     {
  //       driver_id: driver_id,
  //       approval_status: String(approval_status).toLowerCase(),
  //       reason: reason
  //     }
  //  ).catch(function (error) {
  //   if (error.response) {
  //     return {
  //       status: error.response.data.status,
  //       code: error.response.status,
  //       message: error.response.data.message,
  //     }
  //   } else if (error.request) {
  //     console.log("AXIOS ERROR REQUEST>>>>", error.request);
  //   } else {
  //     console.log('Error', error.message);
  //   }
  //   console.log(error.config);
  // });

  
  //  let driver_details
  //  if(Number(axiosResponse.status) < 400){
  //   driver_details = axiosResponse.data.data
  //  } else  {
  //   return {
  //     status:axiosResponse.status,
  //     code: axiosResponse.code,
  //     message: axiosResponse.message
  //   }
  //  }
  

    // sendQueue(
    //   messaging.RIDE_SERVICE_APPROVE_DRIVER,
    //   Buffer.from(JSON.stringify(payload))
    // )

    // sendQueue(
    //   messaging.AUTH_SERVICE_UPDATE_DRIVER,
    //   Buffer.from(JSON.stringify(payload))
    // )

    //Complete Driver Onboarding
    const axiosToAuth = await axiosRequestFunction({
      method: "put",
      url: `${config_env.AUTH_SERVICE_BASE_URL}/driver/complete-driver-onboarding/${driver_id}`,
      data: {
        approval_status: approval_status,
        reason: reason
      }
    })
    if(axiosToAuth.status !== "success"){
      return {
        status: "error",
        code: axiosToAuth.code,
        message: axiosToAuth.message
      }
    }
    return {
      status: "success",
      code: axiosToAuth?.code,
      message: axiosToAuth?.message,
      data: axiosToAuth?.data
    }

  } catch (error) {
    return {
      status:"error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};




exports.syncLocationTrackerFromHub = async (payload) => {
  try {
    const  {
      inspection_code,
      device_number
    } = payload



    const axiosReq = await axiosRequestFunction({
      method: "put",
      url: `${config_env.AUTH_SERVICE_BASE_URL}/car/sync-location-tracker/from-hub`,
      data: {inspection_code, device_number}
    })
  if(axiosReq.status !== "success"){
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
      status:"error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};

exports.syncCameraFromHub = async (payload) => {
  try {
    const  {
      inspection_code,
      device_number
    } = payload


    const axiosReq = await axiosRequestFunction({
      method: "put",
      url: `${config_env.AUTH_SERVICE_BASE_URL}/car/sync-camera/from-hub`,
      data: {inspection_code, device_number}
    })
    if(axiosReq.status !== "success"){
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
      status:"error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};


exports.approveDriverApplicationQuick = async (payload) => {
  try {
    const  {
      inspection_code,
    } = payload
    const fetch_id = await this.fetchDriverByCode({code: inspection_code})
    const approve = await this.approveDeclineDriverApplication({
      driver_id: fetch_id?.data?.driver._id,
      approval_status: "active"
    })

  
    if(approve.status !== "success"){
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
      status:"error",
      code: HTTP_SERVER_ERROR,
      message: error.message
    };
  }
};
