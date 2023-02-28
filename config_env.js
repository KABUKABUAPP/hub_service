const dotenv = require("dotenv");
const path = require("path");

// dotenv.config({
//   path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
// });
dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "local",
  DB_HOST: process.env.DB_HOST || "localhost",
  MONGO_URI: process.env.MONGO_URI || "localhost",
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "localhost",
  MEDIUM_AUTHID: process.env.MEDIUM_AUTHID || "localhost",
  MEDIUM_TOKEN: process.env.MEDIUM_TOKEN || "localhost",
  PORT: process.env.PORT || 3003,
  DB_USERNAME: process.env.DB_USERNAME || 3003,
  DB_PASSWORD: process.env.DB_PASSWORD || 3003,
  CLOUDAMQP_URL: process.env.CLOUDAMQP_URL || 3003,
  REDIS_HOST: process.env.REDIS_HOST || 3003,
  REDIS_PORT: process.env.REDIS_PORT || 3003,
  REDIS_CACHE_TTL: process.env.CACHE_TTL,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || 3003,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || 3003,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 3003,
  JWT_SECRET: process.env.JWT_SECRET || 3003,
  FIRESTORE_USER: process.env.FIRESTORE_USER || 3003,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || 3003,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || 3003,
  SERVICE_PARAM: process.env.SERVICE_PARAM || 3003,
  FLUTTERWAVE_PUBLIC_KEY: process.env.FLUTTERWAVE_SECRET,
  FLW_ITITIALIZE_PAYMENT_URL: process.env.FLW_ITITIALIZE_PAYMENT_URL,
  FLUTTERWAVE_SECRET: process.env.FLUTTERWAVE_SECRET,
  APP_LOGO: process.env.APP_LOGO,
  FLW_EVENT_CALLBACK_URL: process.env.FLW_EVENT_CALLBACK_URL,
  TICKET_CHARGE_PERCENTAGE: process.env.TICKET_CHARGE_PERCENTAGE,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GOOGLE_MAP_API_URL: process.env.GOOGLE_MAP_API_URL,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || 3000,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 3000,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 3000,
};
