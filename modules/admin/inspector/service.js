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
  Hub,
  InspectionDetails
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
const { inspectorsHubsCars } = require("../../inspector/service");
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
      email,
      password,
      username
    } = payload
    const existingInspector = await Inspector.findOne({
      $or: [
        {email: email},
        {phone_number: phone_number}
      ]
    })

    const usernameTaken = await Inspector.findOne({
      username
    })
    if(usernameTaken){
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "Username Aready Taken"
      }
    }
    if(
        (existingInspector) &&  
        (existingInspector.email !== undefined ) && 
        (existingInspector.email !== null) && 
        (existingInspector.phone_number !== undefined) && 
        (existingInspector.phone_number !== null))
      {
      return{
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "An Inspector with this email or phone number already exists"
      }
    }

    const randomPassword = generateRandomString(8)
    const hash = hashPassword(password)
    const newInspector = await Inspector.create({
      first_name,
      last_name,
      phone_number,
      house_address,
      city,
      state,
      email,
      password: hash,
      regCompleted: true,
      username
    });
    const mailData = {
      first_name,
      last_name,
      phone_number: formatPhoneNumber(phone_number),
      email,
      password,
      username,
      queue_type:messaging.NOTIFICATION_MAIL_TO_NEW_INSPECTOR,
    }
    sendQueue(
      messaging.GENERAL_NOTIFICATION_SERVICE_CONSUMER,
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

exports.fetchInspectorByIdService = async (payload) => {
  try {
    const {
      id,
      limit,
      page
    } = payload
    const inspector = await Inspector.findById(id);
    if(!inspector){
      return {
        status: "error",
        code: HTTP_NOT_FOUND,
        message: 'Inspector Not Found',
      }
    }

    const inspectRecord = await inspectorsHubsCars({inspector_id: inspector?._id, limit, page})
    inspector.cars_processed = inspectRecord?.data.cars_processed_by_inspector
    inspector.cars_approved = inspectRecord?.data.cars_approved_by_inspector
    inspector.cars_declined = inspectRecord?.data.cars_declined_by_inspector
    inspector.save()

    return {
      status: "success",
      code: HTTP_OK,
      message: "inspector fetched successfully",
      data: {
        ...inspector._doc,
        // car_inspection_history: inspectRecord.data.driver_histories
      }
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
      page,
      filters,
      order
    } = payload
    const sort = order?
    (order === "newest_first")?["created_at", -1]:(order === "oldest_first")?["created_at", 1]
      :(order === "a-z")?["first_name", 1]:["first_name", -1]:["created_at", -1]

    const records = await getPaginatedRecords(Inspector, {
      limit: limit?Number(limit):10,
      page: page?Number(page):1,
      data: filters,
      selectedFields: "first_name last_name profile_image assigned_hub state country regCompleted",
      populateObj: {
        path: "assigned_hub",
        select: "name"
      },
      sortFilter:[sort]
    })
    let inspectors = records.data

    inspectors = await Promise.all(
        inspectors.map(async (an_inspector) => {
          let obj = {...an_inspector}
          const inspectionData = await inspectorsHubsCars({inspector_id: an_inspector?._id})
          obj._doc.cars_processed = inspectionData.data.cars_processed_by_inspector
          // obj._doc.cars_approved = inspectionData.data.cars_approved_by_inspector
          // obj._doc.cars_declined = inspectionData.data.cars_declined_by_inspector
          return obj._doc
        })
      )
  
    return {
      status: "success",
      code: HTTP_OK,
      message: "inspectors fetched successfully",
      data: {data: inspectors, pagination: records.pagination}
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
    const filter = status?{inspector: inspector_id, status: status}:{inspector:inspector_id}

    const driver_ids = await InspectionDetails.find(filter).distinct("driver")
    const carHistories = await axiosRequestFunction({
      method: "post",
      url: config_env.RIDE_SERVICE_BASE_URL + '/admin/car/inspection-history',
      data: {
        limit,
        page,
        driver_ids,
        search,
      }
    })
    let returnData = {}
    switch (carHistories.status) {
      case "success":
        returnData = {
          status: carHistories.status,
          code: carHistories.code,
          message: status + " Inspected Cars Retreived Successfully",
          data: carHistories?.data
        }
      break;
      case "error":
        returnData = carHistories
      break;
      default:
      break;
    }

    return returnData

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