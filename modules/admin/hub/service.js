const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
  imageUploader,
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
} = require('../../../helpers/paginate')
//const { sendQueue } = require('../queues/index');

exports.addNewHubService = async (payload) => {
  try {
    const {
      name,
      address,
      city,
      state,
      inspector,
      hub_images
    } = payload
    const existinghub = await Hub.findOne({
      $or: [
      {name: name}
      ]
    })
    if(existinghub){
      return{
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "A Hub with this name already exists"
      }
    }
    const images = []

    if(hub_images){
      for(const image of hub_images){
        const url = await imageUploader(image.path)
        images.push(url)
      }
    }

    const newHub = await Hub.create({
      name,
      address,
      city,
      state,
      hub_images: images,
      inspector
    });

    return {
      status: "success",
      code: HTTP_CREATED,
      message: "Hub Added Successfully",
      data: newHub
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


exports.fetchHubByIdService = async (id) => {
  try {
    const hub = await Hub.findById(id)
    .populate("inspector");
    if(!hub){
      return {
        status: "error",
        code: HTTP_NOT_FOUND,
        message: 'Hub Not Found',
      }
    }


    return {
      status: "success",
      code: HTTP_OK,
      message: "hub fetched successfully",
      data: hub,
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


exports.getAllHubsService = async (payload) => {
  try {
    const {
      limit,
      page
    } = payload
    const hubs = await getPaginatedRecords(Hub, {
      limit: limit?Number(limit):10,
      page: page?Number(page):1,
      populate: "inspector"
    })

    return {
      status: "success",
      code: HTTP_OK,
      message: "hubs fetched successfully",
      data: hubs,
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
