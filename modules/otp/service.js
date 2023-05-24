const {
  responseObject,
  authorFewPopulate,
  getVibersIds,
  issueJwt,
  encryptPassword,
  hashPassword,
  comparePassword,
  axiosRequestFunction,
  verificationCode,
  jwtForOtp,
  verifyJwt
} = require("../../helpers");
const {
  HTTP_OK,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../helpers/httpCodes");
const {
  Inspector,
  Hub,
  OneTimePassword
} = require('../../models')
const _ = require("lodash");
const axios = require('axios')

const { sendQueue } = require("../../queues");
const {
  getRedisData,
  saveRedisData,
  deleteRedisData,
  deleteRedisMany,
} = require("../../helpers/cache");
const config_env = require("../../config_env");
const { messaging } = require("../../helpers/constants");
const { updateHubInspections } = require("../hub/service");
const { default: mongoose } = require("mongoose");
//const { sendQueue } = require('../queues/index');

exports.genOtp = async (payload) => {
  try {
    const  {
      user_id,
      phone_number,
      email
    } = payload
   let message, otp
    const otpPayload = {
      user_id: user_id,
      otp: verificationCode(),
      phone_number: phone_number?phone_number:undefined,
      email: email?email:undefined
    }
    otp = await OneTimePassword.create({
      ...otpPayload,
      token: jwtForOtp(otpPayload)
    })
    if(phone_number){
      sendQueue(
        messaging.USER_OTP_SMS,
        Buffer.from(
          JSON.stringify({ phone_number: phone_number, otp: `${otpPayload?.otp}` })
        )
      )
      message= 'OTP sent successfully to' + phone_number

    }
    if(email){
       const mailData = {
        email: email,
        otp: `${otpPayload.otp}`,
      };
      message= 'OTP sent successfully to' + email
       sendQueue(
        messaging.OTP_EMAIL_VERIFICATION,
        Buffer.from(JSON.stringify(mailData))
      );
    }

    return {
      status: "success",
      code: HTTP_OK,
      message: 'OTP Generated Successfully' ,
      data: otp
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error?.message,
      data: error
    };
  }
};

exports.validateOTP = async (payload) => {
  try {
    const  {
      user_id,
      otp,
    } = payload

    const existingOtp = await OneTimePassword.findOne({
      otp: Number(otp),
      user_id
    });
    if (!existingOtp) {
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "Wrong Otp entered Request Otp Again",
      };
    }
    // console.log('HEADER ID', user_id)
    console.log('OTP ID', existingOtp?.user_id)
    const isVerified = verifyJwt(existingOtp.token)
    if (!isVerified) {
      await OneTimePassword.deleteOne({ otp: existingOtp.otp });
      return {
        status: "error",
        code: HTTP_BAD_REQUEST,
        message: "Otp already expired",
      };
    }
    // if(existingOtp.user_id !== user_id ){
    //   await OneTimePassword.deleteOne({ otp: existingOtp.otp });
    //   return {
    //     status: "error",
    //     code: HTTP_BAD_REQUEST,
    //     message: "Wrong Otp entered For This User, Request Otp Again",
    //   }
    // }
    await OneTimePassword.deleteOne({ otp: existingOtp.otp });
    return {
      status: "success",
      code: HTTP_OK,
      message: 'OTP validated Successfully' ,
      data: otp
    }

  } catch (error) {
    console.log(error);
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: "OTP Validation Failed, Try Requesting For A New OTP",
      data: error
    };
  }
};