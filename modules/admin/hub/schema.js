const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.modelIdSchema = Joi.object().keys({
  id: Joi.string().required()
})

exports.paginateSchema = Joi.object().keys({
  page: Joi.number().positive().optional(),
  limit: Joi.number().positive().optional(),
  search: Joi.string().allow(null).allow('').optional(),
  order: Joi.string().valid("oldest_first", "newest_first", "a-z", "z-a").allow(null).allow('').optional(),
  status: Joi.string().valid("active", "pending",).allow(null).allow('').optional(),
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

exports.userloginSchema = Joi.object().keys({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

exports.viewInspectedCarsSchema = Joi.object().keys({
  limit: Joi.number().positive().required(),
  page: Joi.number().positive().required(),
  status: Joi.string().valid("approved", "declined").required(),
  search: Joi.string().allow(null).allow("").optional(),

})