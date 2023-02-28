const { HTTP_BAD_REQUEST } = require("../helpers/httpCodes");

/**
 * Creates a middleware to validate request payloads with Joi schemas
 */
module.exports = function validateRequest(schema, field = "body") {
  return function validateRequest(req, res, next) {
    const result = schema.validate(req[field], {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: "",
        },
      },
    });
    if (result.error) {
      const parsedResult = Array.isArray(result.error.details)
        ? result.error.details.map((error) => ({
            [String(error.path[0])]: error.message,
          }))
        : [
            {
              [String(result.error.message.split(" ")[0])]:
                result.error.message,
            },
          ];
      console.log("JOi res", parsedResult);

      return res.status(HTTP_BAD_REQUEST).json({
        status: HTTP_BAD_REQUEST,
        message: "Validation failed",
        data: parsedResult,
      });
    }

    req[field] = result.value;
    return next();
  };
};
