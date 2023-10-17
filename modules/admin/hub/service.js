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
const { inspectorsHubsCars } = require("../../inspector/service");
const config_env = require("../../../config_env");
const { default: mongoose } = require("mongoose");
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
      {name: {$regex:name, $options:"i"}}
      ],
      deleted: false
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
      inspector: inspector?inspector:undefined
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


exports.fetchHubByIdService = async (id, limit, page) => {
  try {
    const hub = await Hub.findOne({_id: mongoose.Types.ObjectId(id), deleted: false})
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

    const inspectRecord = await inspectorsHubsCars({hub_id: hub?._id, limit,page})
    hub.cars_processed = inspectRecord?.data.cars_processed_in_hub
    hub.cars_approved = inspectRecord?.data.cars_approved_in_hub
    hub.cars_declined = inspectRecord?.data.cars_declined_in_hub
    hub.save()
    

    return {
      status: "success",
      code: HTTP_OK,
      message: "hub fetched successfully",
      data: {
        ...hub._doc,
        // car_inspection_history: inspectRecord?.data.driver_histories
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
      data: {...search, deleted: false},
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
    const stateHub = await Hub.findOne({state:{$regex: state, $options: "i" }, deleted: false})
    const cityHub = await Hub.findOne({city:{$regex: city, $options: "i" }, deleted: false})
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
    const filter = status?{hub: hub_id, status: status}:{hub:hub_id}
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

exports.removeHub = async (payload) => {
  try {
    const {
      hub_id
    } = payload
    
    const hub = await Hub.findOne({
      _id: mongoose.Types.ObjectId(hub_id),
      deleted: false,
    })
    if(!hub){
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "Hub Not Found"
      }
    }

    
    const deleted = await Hub.findByIdAndUpdate(hub_id, {
      name: hub?.name + " DELETED",
      deleted: true
    }, {new: true})
    
    return  {
      status: "success",
      code: HTTP_OK,
      message: "Hub Deleted Successfully",
      
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
}