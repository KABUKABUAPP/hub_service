const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
} = require("../helpers");
const {
  HTTP_OK,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../helpers/httpCodes");
const Users = require("../models/user");

const Report = require("../models/report");

const Rooms = require("../models/room");

const _ = require("lodash");

const { sendQueue } = require("../queues");
const {
  getRedisData,
  saveRedisData,
  deleteRedisData,
  deleteRedisMany,
} = require("../helpers/cache");
//const { sendQueue } = require('../queues/index');

exports.createUser = async (user) => {
  try {
    const userData = {
      user_id: parseInt(user.id),
      user_type: user.user_type,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.first_name + " " + user.last_name,
      email: user.email,
      phone: user.phone,
      profile_image: user.profile_image,
      dob: user.birthdate,
      address: user.address,
      country: user.country,
      state: user.state,
      city: user.city,
      lat: user.lat,
      long: user.long,
      occupation: user.occupation,
      organisation_name: user.organisation_name,
      school: user.school,
      school_location: user.school_location,
      course: user.course,
      corpServiceLocation: user.corpServiceLocation,
      graduation_year: user.graduation_year,
      facebook_link: user.facebook_link,
      instagram_link: user.instagram_link,
      twitter_link: user.twitter_link,
      onboarding_step: user.onboarding_step,
    };
    Users.create(userData, async (err, user) => {
      if (err) {
        console.log(err);
        return false;
      }

      await Settings.create({ user_id: parseInt(user.id) });
      return true;
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};
