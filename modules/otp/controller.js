const { responseObject, authorFewPopulate, formatPhoneNumber } = require("../../helpers");
const {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../helpers/httpCodes");
const otpService = require("./service");

exports.genOTPController = async (req, res) => {
  try {
    const payload = {
      user_id: req.userId,
      email: req.query.email,
      phone_number: req.query.phone_number
    }
    const {status, code, message, data} = await otpService.genOtp(payload);
    return responseObject(
      res,
      code,
      status,
      data,
      message
    );
  } catch (error) {
    console.log(error);
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};

exports.validateOTPController = async (req, res) => {
  try {
    const payload = {
      otp: req.body.otp
    }
    const {status, code, message, data} = await otpService.validateOTP(payload);
    return responseObject(
      res,
      code,
      status,
      data,
      message
    );
  } catch (error) {
    console.log(error);
    return responseObject(
      res,
      HTTP_SERVER_ERROR,
      "error",
      null,
      error.toString()
    );
  }
};
