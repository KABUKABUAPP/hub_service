const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);
const pattern= "/^[0-9+]{7}-[0-9+]{1}$/"

exports.modelIdSchema = Joi.object().keys({
  id: Joi.string().required()
})

exports.quickApproveSchema = Joi.object().keys({
  inspection_code: Joi.string().required()
})

exports.paginateSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  page: Joi.number().optional(),
  isVerified: Joi.boolean().default(false).optional(),

})

exports.addNewInspectorSchema = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .trim()
    .optional()
    .label("phone_number").optional(),
  house_address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  email: Joi.string().email().trim().required(),

});

exports.loginSchema = Joi.object().keys({
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
});
exports.createNewPasswordSchema = Joi.object().keys({
  new_password: Joi.string().alphanum().min(8).max(30).required(),
  otp: Joi.number().required(),
});

exports.fetchDriverSchema = Joi.object().keys({
  inspection_code: Joi.string().required(),
});

exports.approveDeclineDriverSchema = Joi.object().keys({
  approval_status: Joi.string().valid('active', 'declined').required(),
  reason: Joi.string().optional(),
});

exports.synchDevicesSchema = Joi.object().keys({
  inspection_code: Joi.string().required(),
  device_number: Joi.string().required(),
})

exports.updatePasswordSchema = Joi.object().keys({
  current_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

exports.forgotPasswordSchema = Joi.object().keys({
  phone_number: Joi.string().required(),
});

exports.resetPasswordSchema = Joi.object().keys({
  new_password: Joi.string().required(),
  otp: Joi.number().required(),
});