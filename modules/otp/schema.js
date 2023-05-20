const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);
const pattern= "/^[0-9+]{7}-[0-9+]{1}$/"

exports.modelIdSchema = Joi.object().keys({
  id: Joi.string().required()
})

exports.genOTPSchema = Joi.object().keys({
  phone_number: Joi.string().optional(),
  email: Joi.string().optional(),
});
exports.validateOTPSchema = Joi.object().keys({
  otp: Joi.number().required(),
  // new_password: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{8,32}$')).required()
});

