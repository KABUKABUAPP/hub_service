const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
} = require("../../helpers");
const {
  HTTP_OK,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../helpers/httpCodes");
const _ = require("lodash");

const { sendQueue } = require("../../queues");
const {
  getRedisData,
  saveRedisData,
  deleteRedisData,
  deleteRedisMany,
} = require("../../helpers/cache");
const { Hub, InspectionDetails, Inspector } = require("../../models");
//const { sendQueue } = require('../queues/index');

exports.updateHubInspections = async (payload) => {
  try {
    const {
      hub_id,
      status,
      driver_id
    } = payload
    const hub = await Hub.findById(hub_id)
    if (hub) {
      const no_of_cars = await InspectionDetails.find({ hub: hub_id }).countDocuments()
      const no_of_cars_processed = await InspectionDetails.find({ hub: hub_id, status: status }).countDocuments()
      if (status === "approved") {
        await Hub.findByIdAndUpdate(hub_id,
          {
            cars_processed: no_of_cars,
            cars_approved: no_of_cars_processed
          }

        )
      }
      if (status === "declined") {
        await Hub.findByIdAndUpdate(hub_id,
          {
            cars_processed: no_of_cars,
            cars_declined: no_of_cars_processed
          }

        )
      }
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};


exports.fetchHubByLocationService = async (payload) => {
  try {
    const {
      city, state
    } = payload
    let foundHub
    const stateHub = await Hub.findOne({ state: { $regex: state, $options: "i" }, deleted: false })
    const cityHub = await Hub.findOne({ city: { $regex: city, $options: "i" }, deleted: false })
    foundHub = cityHub ? cityHub : stateHub ? stateHub : await Hub.findOne({})
    if (!foundHub) {
      return {
        status: "error",
        code: HTTP_NOT_FOUND,
        message: 'Hub Not Found',
      }
    }

    console.log("FETCHED HUB>>>>>>>", foundHub)

    return {
      status: "success",
      code: HTTP_OK,
      message: "hub fetched successfully",
      data: foundHub,
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

exports.fetchAssignedHubDetails = async (id) => {
  try {
    const availableInspector = await Inspector.findOne({
      assigned_hub: id
    }).populate({
      path: "assigned_hub",
      select: 'name address city state'
    })
    const hubDetails = {
      first_name: availableInspector?.first_name || "",
      last_name: availableInspector?.last_name || "",
      phone_number: availableInspector?.phone_number || "",
      address: availableInspector?.assigned_hub?.address || "",
      city: availableInspector?.assigned_hub?.city || "",
      state: availableInspector?.assigned_hub?.state || "",
    }



    return {
      status: "success",
      code: HTTP_OK,
      message: "hub Details  fetched successfully",
      data: hubDetails,
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

exports.fetchHubByIdService = async (hub_id) => {
  try {

    const foundHub = await Hub.findOne({ _id: hub_id, deleted: false })
      .select(" _id name address city state country hub_images inspector deleted ")
    if (!foundHub) {
      return {
        status: "error",
        code: HTTP_NOT_FOUND,
        message: 'Hub Not Found',
      }
    }

    const inspectors = await Inspector.find({ assigned_hub: hub_id })
      .select("_id first_name last_name phone_number email deleted ")


    return {
      status: "success",
      code: HTTP_OK,
      message: "hub fetched successfully",
      data: {
        hub_details: foundHub,
        inspectors: inspectors
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