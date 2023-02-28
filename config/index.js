const DATA_LIMIT = 20;
const cloudinary = require('./cloudinary.js')
const multerUpload = require('./multer.js')
const config = require("../config_env.js");

module.exports = {
  // DATA_LIMIT,
  // EVENT_STATUS: {
  //   CANCELLED: "cancelled",
  //   COMPLETED: "completed",
  //   ONGOING: "ongoing",
  //   UPCOMING: "upcoming",
  // },
  // APPROVAL_STATUS: {
  //   PENDING: "pending",
  //   APPROVED: "approved",
  //   DECLINED: "declined",
  // },

  // FLUTTERWAVE_PUBLIC_KEY: config.FLUTTERWAVE_PUBLIC_KEY,
  // FLUTTERWAVE_SECRET: config.FLUTTERWAVE_SECRET,
  // APP_URL: config.APP_URL,
  // FLW_ITITIALIZE_PAYMENT_URL: config.FLW_ITITIALIZE_PAYMENT_URL,
  // FLW_EVENT_CALLBACK_URL: config.FLW_EVENT_CALLBACK_URL,
  // APP_LOGO: config.APP_LOGO,
  // TICKET_CHARGE_PERCENTAGE: config.TICKET_CHARGE_PERCENTAGE,
  cloudinary,
  multerUpload
};
