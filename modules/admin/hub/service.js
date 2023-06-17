const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
  imageUploader,
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
const { inspectorsHubsCars } = require("../../inspector/service");
const config_env = require("../../../config_env");
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
    .populate({
      path: "inspector",
      select:{
        first_name:1, 
        last_name:1, 
        profile_image:1, 
        phone_number:1, 
        email:1,
        city:1,
        state:1
      }
    });
    if(!hub){
      return {
        status: "error",
        code: HTTP_NOT_FOUND,
        message: 'Hub Not Found',
      }
    }

    const inspectRecord = await inspectorsHubsCars({hub_id: hub?._id})
    hub.cars_processed = inspectRecord?.data.cars_processed_in_hub
    hub.cars_approved = inspectRecord?.data.cars_approved_in_hub
    hub.cars_declined = inspectRecord?.data.cars_declined_in_hub
    hub.save()

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
      page,
      search,
      order
    } = payload
    const sort = order?
    (order === "newest_first")?["created_at", -1]:(order === "oldest_first")?["created_at", 1]
      :(order === "a-z")?["name", 1]:["name", -1]:["created_at", -1]
    const hubs = await getPaginatedRecords(Hub, {
      limit: limit?Number(limit):10,
      page: page?Number(page):1,
      data: search,
      populateObj: {
        path: "inspector",
        select: 'first_name last_name'
      },
      selectedFields: "_id name address city state country inspector cars_processed created_at",
      sortFilter: [sort]
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


exports.fetchHubByLocationService = async (payload) => {
  try {
    const {
      city, state
    } = payload
    let foundHub
    const stateHub = await Hub.findOne({state:{$regex: state, $options: "i" }})
    const cityHub = await Hub.findOne({city:{$regex: city, $options: "i" }})
    foundHub = cityHub?cityHub:stateHub
    .populate("inspector");
    if(!foundHub){
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

exports.viewInspectedCars = async (payload) => {
  try {
    const {
      hub_id,
      status,
      search,
      limit,
      page
    } = payload
    console.log(payload)
    const axiosReq = await axiosRequestFunction({
      method: "get",
      url: config_env.RIDE_SERVICE_BASE_URL + `/car/view-inspected-cars/hub/${hub_id}`,
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