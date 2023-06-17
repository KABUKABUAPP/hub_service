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
  approveDriverApplicationQuick,
  fetchAssignedApplications,
  viewProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  viewADriver,
  updateProfilePicture,
  
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
      otp: req.body.otp
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

exports.viewInspectorProfileController = async (req, res) => {
  try {
    const payload = {
      user: req.user
    }
    const {status, code, message, data} = await viewProfile(payload);
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

exports.updateProfilePictureController = async (req, res) => {
  try {
    const payload = {
      inspector: req.user,
      picture: req.file
    }
    const {status, code, message, data} = await updateProfilePicture(payload);
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

exports.updatePasswordController = async (req, res) => {
  try {
    const payload = {
      inspector: req.user,
      password: req.body.current_password,
      newPassword: req.body.new_password
    }
    const {status, code, message, data} = await updatePassword(payload);
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

exports.forgotPasswordController = async (req, res) => {
  try {
    const payload = {
      phone_number: req.body.phone_number
    }
    const {status, code, message, data} = await forgotPassword(payload);
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

exports.resetPasswordController = async (req, res) => {
  try {
    const payload = {
      inspector: req.user,
      new_password: req.body.new_password,
      otp: req.body.otp,
    }
    const {status, code, message, data} = await resetPassword(payload);
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
      hub_id: req.user.assigned_hub,
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
      inspector: req.user,
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

exports.fetchAssignedApplicationsController = async (req, res) => {
  try {
    const payload = {
      user: req.user,
      limit: req.query.limit,
      page: req.query.page,
      approval_status: req.query.approval_status,
      date: req.query.date,
      driver_name: req.query.driver_name,
    }
    const {status, code, message, data} = await fetchAssignedApplications(payload);
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

exports.viewADriverController = async (req, res) => {
  try {
    const payload = {
      user: req.user,
      driver_id: req.params.id
    }
    const {status, code, message, data} = await viewADriver(payload);
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