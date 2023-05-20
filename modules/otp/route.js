const { Router } = require("express");

// const { auth } = require("../../isAuthenticated");
const { authTest, isAuthorized, authorizeInspectorLogin } = require("../../middlewares/auth");
const otpController = require("./controller");
const validateRequest = require("../../middlewares/validateRequest");
const { 
  genOTPSchema,
  validateOTPSchema
 } = require("./schema");

const router = Router();

router.get(
  "/generate", 
  isAuthorized,
  validateRequest(genOTPSchema, "query"),
  otpController.genOTPController
);

router.post(
  "/validate", 
  validateRequest(validateOTPSchema, "body"),
  otpController.validateOTPController
);

module.exports = router;
