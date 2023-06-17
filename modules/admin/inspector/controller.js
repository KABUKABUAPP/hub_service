const { responseObject, authorFewPopulate, formatPhoneNumber } = require("../../../helpers");
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
  getAllInspectorsService,
  viewInspectedCars
} = require("./service");

exports.addNewInspectorController = async (req, res, next) => {
  try {
    const payload = {
      first_name: String(req.body.first_name).toLowerCase(),
      last_name: String(req.body.last_name).toLowerCase(),
      house_address: String(req.body.house_address).toLowerCase(),
      phone_number: formatPhoneNumber(String(req.body.phone_number).toLowerCase()),
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
    const inspectorStatus = req.query?.status?(req.query?.status === "active")?true:(req.query.status === "pending")?false:undefined:undefined
    const payload = {
      limit: req.query.limit,
      page: req.query.page,
      filters: {
        ...((inspectorStatus !== null && inspectorStatus!== "" && inspectorStatus !== undefined) && {regCompleted: inspectorStatus}),
        ...((req.query?.search && req.query?.search !== null &&  req.query?.search !== "" &&  req.query?.search  !== undefined) && {$or: [{first_name: {$regex:  req.query?.search , $options: "i"}}, {last_name: {$regex:  req.query?.search , $options: "i"}}]}),
      },
      order: req.query?.order 
    }
    console.log("🚀 ~ file: controller.js:91 ~ exports.getAllInspectorsController= ~ payload:", payload)

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


exports.viewInspectedCarsController = async (req, res, next) => {
  try {
    const payload = {
      limit: req.query.limit,
      page: req.query.page,
      search: req.query.search,
      status: req.query.status,
      inspector_id: req.params.id
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