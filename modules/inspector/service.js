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
//const { sendQueue } = require('../queues/index');

exports.createUser = async (user) => {
  try {
    const userData = {
      _id: user._id,
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email,
      profile_image: user.profile_image,
      type: user.type,
      isBlocked: user.isBlocked,
      accessTokens: user.accessTokens,
      next_of_kin: user.next_of_kin,
      onboarding_step: user.onboarding_step,
      is_onboarding_complete: user.is_onboarding_complete,
      driver: user.driver,
      accessory_id: user.accessory_id,
      guarantor: user.guarantor,
      latitude_location: user.latitude_location,
      longitude_location: user.longitude_location
    };
    await User.create(userData, async (err, user) => {
      if (err) {
        console.log(err);
        return false;
      }

      return true;
    });
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
