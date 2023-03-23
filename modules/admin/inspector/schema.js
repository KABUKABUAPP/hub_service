const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

exports.modelIdSchema = Joi.object().keys({
  id: Joi.string().required()
})

exports.paginateSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  page: Joi.number().optional(),

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