const { Router } = require("express");

// const { auth } = require("../../isAuthenticated");
const { authTest, isAuthorized } = require("../../middlewares/auth");
const { 
  enterPhoneOrEmailController, 
  createPasswordController, 
  loginController,
  fetchDriverController,
  approveDeclineDriverApplicationController
} = require("./controller");
const validateRequest = require("../../middlewares/validateRequest");
const { 
  loginSchema,
  fetchDriverSchema,
  modelIdSchema,
  approveDeclineDriverSchema
 } = require("./schema");

const router = Router();

router.post(
  "/enter-phone-or-email", 
  enterPhoneOrEmailController
);

router.post(
  "/create-password", 
  isAuthorized,
  createPasswordController
);

router.post(
  "/login",
  validateRequest(loginSchema, "body"),
  loginController
);

router.get(
  "/fetch-driver",
  validateRequest(fetchDriverSchema, "query"),
  fetchDriverController
);

router.post(
  "/approve-driver/:id",
  validateRequest(modelIdSchema, "params"),
  validateRequest(approveDeclineDriverSchema, "body"),
  approveDeclineDriverApplicationController
);

module.exports = router;
