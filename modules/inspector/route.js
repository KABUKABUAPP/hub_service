const { Router } = require("express");

// const { auth } = require("../../isAuthenticated");
const { authTest, isAuthorized } = require("../../middlewares/auth");
const { 
  enterPhoneOrEmailController, 
  createPasswordController, 
  loginController,
  fetchDriverController,
  approveDeclineDriverApplicationController,
  synchronizeCameraController,
  synchronizeLocationTrackerController,
  approveDriverApplicationQuickController
} = require("./controller");
const validateRequest = require("../../middlewares/validateRequest");
const { 
  loginSchema,
  fetchDriverSchema,
  modelIdSchema,
  approveDeclineDriverSchema,
  synchDevicesSchema,
  quickApproveSchema
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

router.get(
  "/approve-driver-quick/:inspection_code",
  validateRequest(quickApproveSchema, "params"),
  // validateRequest(approveDeclineDriverSchema, "body"),
  approveDriverApplicationQuickController
);

router.get(
  "/sync-camera/:inspection_code/:device_number", 
  // isAuthorized, 
  validateRequest(synchDevicesSchema, "params"),
  synchronizeCameraController
);

router.get(
  "/sync-location-tracker/:inspection_code/:device_number", 
  // isAuthorized, 
  validateRequest(synchDevicesSchema, "params"),
  synchronizeLocationTrackerController
);

module.exports = router;
