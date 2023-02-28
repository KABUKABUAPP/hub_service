const { responseObject, authorFewPopulate } = require("../../../helpers");
const {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../../helpers/httpCodes");
const { 
  addNewHubService,
  fetchHubByIdService,
  getAllHubsService
} = require("./service");

exports.addNewHubController = async (req, res, next) => {
  try {
    const payload = {
      name: String(req.body.name).toLowerCase(),
      address: String(req.body.address).toLowerCase(),
      city: String(req.body.city).toLowerCase(),
      state: String(req.body.state).toLowerCase(),
      inspector: String(req.body.inspector).toLowerCase(),
      hub_images: req.files
    }
    const {status, code, message, data} = await addNewHubService(payload);

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

exports.fetchHubByIdController = async (req, res, next) => {
  try {

    const {status, code, message, data} = await fetchHubByIdService(req.params.id);

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

exports.getAllHubsController = async (req, res, next) => {
  try {
    const payload = {
      limit: req.query.limit,
      page: req.query.page
    }

    const {status, code, message, data} = await getAllHubsService(payload);

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
