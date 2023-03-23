const { responseObject, authorFewPopulate, formatPhoneNumber } = require("../../helpers");
const {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../helpers/httpCodes");
const { 
  enterPhoneOrEmail,
  createPassword,
  login,
  fetchDriverByCode,
  approveDeclineDriverApplication
} = require("./service");

exports.enterPhoneOrEmailController = async (req, res) => {
  try {
    const payload = {
      email_or_number: formatPhoneNumber(req.body.email_or_number),
    }
    const {status, code, message, data} = await enterPhoneOrEmail(payload);
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

exports.createPasswordController = async (req, res) => {
  try {
    const payload = {
      inspector: req.user,
      password: req.body.password,
    }
    const {status, code, message, data} = await createPassword(payload);
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

exports.loginController = async (req, res) => {
  try {
    const payload = {
      phone_number: formatPhoneNumber(String(req.body.phone_number).toLowerCase()),
      password: req.body.password,
    }
    const {status, code, message, data} = await login(payload);
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

exports.fetchDriverController = async (req, res) => {
  try {
    const payload = {
      code: req.query.inspection_code
    }
    const {status, code, message, data} = await fetchDriverByCode(payload);
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

exports.approveDeclineDriverApplicationController = async (req, res) => {
  try {
    const payload = {
      driver_id: req.params.id,
      approval_status: req.body.approval_status,
      reason: req.body.reason
    }
    const {status, code, message, data} = await approveDeclineDriverApplication(payload);
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