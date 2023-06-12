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
const { Hub, InspectionDetails } = require("../../models");
//const { sendQueue } = require('../queues/index');

exports.updateHubInspections = async (payload) => {
  try {
    const {
      hub_id,
      status,
      driver_id
    } = payload
    const hub = await Hub.findById(hub_id)
    if(hub){
      const no_of_cars = await InspectionDetails.find({hub: hub_id}).countDocuments()
      const no_of_cars_processed = await InspectionDetails.find({hub: hub_id, status: status}).countDocuments()
      if (status === "approved"){
        await Hub.findByIdAndUpdate(hub_id, 
          { 
            cars_processed: no_of_cars,
            cars_approved: no_of_cars_processed
          }

        )
      }
      if(status === "declined"){
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

exports.fetchUserByIdService = async (userId) => {
  try {
    const user = await User.findById(userId);

    return {
      status: "success",
      code: HTTP_OK,
      message: "user fetched successfully",
      data: user,
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


exports.updateUser = async (payload) => {
  try {
    const {id, data} = payload
    await User.findByIdAndUpdate(id, {...data});
    const updatedUser = await User.findById(id)
    return {
      status: "success",
      code: HTTP_OK,
      message: "user updated successfully",
      data: updatedUser,
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


exports.fetchHubByLocationService = async (payload) => {
  try {
    const {
      city, state
    } = payload
    let foundHub
    const stateHub = await Hub.findOne({state:{$regex: state, $options: "i" }})
    const cityHub = await Hub.findOne({city:{$regex: city, $options: "i" }})
    foundHub = cityHub?cityHub:stateHub
    if(!foundHub){
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