const { responseObject, authorFewPopulate } = require("../../../helpers");
const {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../../helpers/httpCodes");
const { 
  addNewInspectorService,
  fetchInspectorByIdService,
  getAllInspectorsService
} = require("./service");

exports.addNewInspectorController = async (req, res, next) => {
  try {
    const payload = {
      first_name: String(req.body.first_name).toLowerCase(),
      last_name: String(req.body.last_name).toLowerCase(),
      house_address: String(req.body.house_address).toLowerCase(),
      phone_number: String(req.body.phone_number).toLowerCase(),
      city: String(req.body.city).toLowerCase(),
      state: String(req.body.state).toLowerCase(),
      email: String(req.body.email).toLowerCase()
    }
    const {status, code, message, data} = await addNewInspectorService(payload);

    return next (
      responseObject(
        res,
        code,
        status,
        data,
        message
      )
    );
  } catch (error) {
    console.log(error);
    return next(
      responseObject(
        res,
        HTTP_SERVER_ERROR,
        "error",
        null,
        error.toString()
      )
    )
  }
};


exports.fetchInspectorByIdController = async (req, res, next) => {
  try {

    const {status, code, message, data} = await fetchInspectorByIdService(req.params.id);

    return next (
      responseObject(
        res,
        code,
        status,
        data,
        message
      )
    );
  } catch (error) {
    console.log(error);
    return next(
      responseObject(
        res,
        HTTP_SERVER_ERROR,
        "error",
        null,
        error.toString()
      )
    )
  }
};

exports.getAllInspectorsController = async (req, res, next) => {
  try {
    const payload = {
      limit: req.query.limit,
      page: req.query.page
    }

    const {status, code, message, data} = await getAllInspectorsService(payload);

    return next (
      responseObject(
        res,
        code,
        status,
        data,
        message
      )
    );
  } catch (error) {
    console.log(error);
    return next(
      responseObject(
        res,
        HTTP_SERVER_ERROR,
        "error",
        null,
        error.toString()
      )
    )
  }
};
