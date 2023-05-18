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
  approveDeclineDriverApplication,
  syncCameraFromHub,
  syncLocationTrackerFromHub,
  approveDriverApplicationQuick
} = require("./service");

exports.loginController = async (req, res) => {
  try {
    const payload = {
     inspector: req.user,
     password: req.body.password
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

exports.createPasswordController = async (req, res) => {
  try {
    const payload = {
      inspector: req.user,
      password: req.body.new_password,
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
      inspector: req.user,
      hub_id: req.assigned_hub,
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

exports.approveDriverApplicationQuickController = async (req, res) => {
  try {
    const payload = {
      inspection_code: req.params.inspection_code,
    }
    const {status, code, message, data} = await approveDriverApplicationQuick(payload);
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

exports.synchronizeCameraController = async (req, res) => {
  try {
    const payload = {
      inspection_code: req.params.inspection_code,
      device_number: req.params.device_number,
    }
    const {status, code, message, data} = await syncCameraFromHub(payload);
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

exports.synchronizeLocationTrackerController = async (req, res) => {
  try {
    const payload = {
      inspection_code: req.params.inspection_code,
      device_number: req.params.device_number,
    }
    const {status, code, message, data} = await syncLocationTrackerFromHub(payload);
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