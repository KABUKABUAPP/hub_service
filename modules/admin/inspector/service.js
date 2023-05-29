const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
  getRandomRef,
  generateRandomString,
  hashPassword,
  formatPhoneNumber,
  axiosRequestFunction,
} = require("../../../helpers");
const {
  HTTP_OK,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
} = require("../../../helpers/httpCodes");
const {
  Inspector,
  Hub
} = require("../../../models");

const _ = require("lodash");

const { sendQueue } = require("../../../queues");
const {
  getRedisData,
  saveRedisData,
  deleteRedisData,
  deleteRedisMany,
} = require("../../../helpers/cache");
const {
  getPaginatedRecords
} = require('../../../helpers/paginate');
const { messaging } = require("../../../helpers/constants");
const config_env = require("../../../config_env");
//const { sendQueue } = require('../queues/index');

exports.addNewInspectorService = async (payload) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      house_address,
      city,
      state,
      email
    } = payload
    const existingInspector = await Inspector.findOne({
      $or: [
        {email: email},
        {phone_number: phone_number}
      ]
    })
    if(existingInspector){
      return{
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "An Inspector with this email or phone number already exists"
      }
    }

    const randomPassword = generateRandomString(8)
    const hash = hashPassword(randomPassword)
    const newInspector = await Inspector.create({
      first_name,
      last_name,
      phone_number: formatPhoneNumber(phone_number),
      house_address,
      city,
      state,
      email,
      password: hash
    });
    const mailData = {
      first_name,
      last_name,
      phone_number: formatPhoneNumber(phone_number),
      email,
      password: randomPassword
    }
    sendQueue(
      messaging.NOTIFICATION_MAIL_TO_NEW_INSPECTOR,
      Buffer.from(JSON.stringify(mailData))
    )

    return {
      status: "success",
      code: HTTP_CREATED,
      message: "Inspector Added Successfully",
      data: newInspector
    }
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: error?.message,
      data: error.toString(),
      code: HTTP_SERVER_ERROR,
    };
  }
};

exports.fetchInspectorByIdService = async (id) => {
  try {
    const inspector = await Inspector.findById(id);
    if(!inspector){
      return {
        status: "error",
        code: HTTP_NOT_FOUND,
        message: 'Inspector Not Found',
      }
    }


    return {
      status: "success",
      code: HTTP_OK,
      message: "inspector fetched successfully",
      data: inspector,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: error?.message,
      data: error.toString(),
      code: HTTP_SERVER_ERROR,
    };
  }
};


exports.getAllInspectorsService = async (payload) => {
  try {
    const {
      limit,
      page
    } = payload
    const inspectors = await getPaginatedRecords(Inspector, {
      limit: limit?Number(limit):10,
      page: page?Number(page):1,
      data: {regCompleted: true}
    })

    return {
      status: "success",
      code: HTTP_OK,
      message: "inspectors fetched successfully",
      data: inspectors,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: error?.message,
      data: error.toString(),
      code: HTTP_SERVER_ERROR,
    };
  }
};


exports.viewInspectedCars = async (payload) => {
  try {
    const {
      inspector_id,
      status,
      search,
      limit,
      page
    } = payload
    console.log(payload)
    const axiosReq = await axiosRequestFunction({
      method: "get",
      url: config_env.RIDE_SERVICE_BASE_URL + `/car/view-inspected-cars/${inspector_id}`,
      params: {
        limit, page, status, search
      }
    })
    return axiosReq

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: error?.message,
      data: error.toString(),
      code: HTTP_SERVER_ERROR,
    };
  }
};