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
  getAllHubsService,
  fetchHubByLocationService,
  viewInspectedCars,
  removeHub
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
    const searchField = req.query?.search?req.query.search:undefined
    console.log("🚀 ~ file: controller.js:82 ~ exports.getAllHubsController= ~ searchField:", searchField)

    const payload = {
      limit: req.query?.limit,
      page: req.query?.page,
      order: req.query?.order,
      search: {
        ...(((searchField) && (searchField !== null) && (searchField !== "")) && {
          $or: [
            {name: {$regex: searchField, $options:"i"}},
            {address: {$regex: searchField, $options:"i"}},
            {city: {$regex: searchField, $options:"i"}},
            {state: {$regex: searchField, $options:"i"}},
            {country: {$regex: searchField, $options:"i"}},
          ]
        } )
      }
    }
    console.log("🚀 ~ file: controller.js:99 ~ exports.getAllHubsController= ~ payload:", payload)

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


exports.fetchHubsByLocationController = async (req, res, next) => {
  try {
    const payload = {
      state: req.query.state,
      city: req.query.city
    }

    const {status, code, message, data} = await fetchHubByLocationService(payload);

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


exports.viewInspectedCarsController = async (req, res, next) => {
  try {
    const payload = {
      limit: req.query.limit,
      page: req.query.page,
      search: req.query.search,
      status: req.query.status,
      hub_id: req.params.id
    }

    const {status, code, message, data} = await viewInspectedCars(payload);

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

exports.removeHubController = async (req, res, next) => {
  try {

    const {status, code, message, data} = await removeHub({
     hub_id: req.params.id
    });

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