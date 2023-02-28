const { responseObject, authorFewPopulate } = require("../../helpers");
const {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} = require("../../helpers/httpCodes");
const { fetchUserService, fetchUserByIdService } = require("./service");

exports.fetchUser = async (req, res) => {
  try {
    const response = await fetchUserService(req.userId);
    console.log("User: ", response);

    return responseObject(
      res,
      response.code,
      response.status,
      response.data,
      response.message
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
exports.fetchUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await fetchUserService(userId);

    console.log("User: ", response);

    return responseObject(
      res,
      response.code,
      response.status,
      response.data,
      response.message
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
exports.fetchUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await fetchUserByIdService(userId);

    console.log("User: ", response);

    return responseObject(
      res,
      response.code,
      response.status,
      response.data,
      response.message
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
