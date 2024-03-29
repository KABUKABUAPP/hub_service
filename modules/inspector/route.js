const { Router } = require("express");

// const { auth } = require("../../isAuthenticated");
const { authTest, isAuthorized, authorizeInspectorLogin } = require("../../middlewares/auth");
const {
  enterPhoneOrEmailController,
  createPasswordController,
  loginController,
  fetchDriverController,
  approveDeclineDriverApplicationController,
  synchronizeCameraController,
  synchronizeLocationTrackerController,
  approveDriverApplicationQuickController,
  fetchAssignedApplicationsController,
  viewInspectorProfileController,
  updatePasswordController,
  forgotPasswordController,
  resetPasswordController,
  viewADriverController,
  updateProfilePictureController,
  validateTokenController,
  getAssignedSharpCarsController,
  markCarsAsDeliveredController,
  fetchCarsFromCarOwnersForInspectionController,
  inspectSharpPrivateCarController
} = require("./controller");
const validateRequest = require("../../middlewares/validateRequest");
const {
  loginSchema,
  fetchDriverSchema,
  modelIdSchema,
  approveDeclineDriverSchema,
  synchDevicesSchema,
  quickApproveSchema,
  createNewPasswordSchema,
  paginateSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateTokenSchema,
  getSharpCarsSchema,
  paginateHubCarsSchema,
  inspectSharpPrivateCarSchema
} = require("./schema");
const { multerUpload } = require("../../config");

const router = Router();

router.post(
  "/login",
  validateRequest(loginSchema, "body"),
  authorizeInspectorLogin,
  loginController
);

router.post(
  "/create-password",
  validateRequest(createNewPasswordSchema, "body"),
  isAuthorized,
  createPasswordController
);

router.get(
  "/view-profile",
  isAuthorized,
  viewInspectorProfileController
);

router.put(
  "/update-profile-image",
  isAuthorized,
  multerUpload.single('profile_image'),
  updateProfilePictureController

);

router.put(
  "/update-password",
  validateRequest(updatePasswordSchema, "body"),
  isAuthorized,
  updatePasswordController
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema, "body"),
  forgotPasswordController
);

router.put(
  "/reset-password",
  isAuthorized,
  validateRequest(resetPasswordSchema, "body"),
  resetPasswordController
);

router.get(
  "/fetch-driver",
  validateRequest(fetchDriverSchema, "query"),
  fetchDriverController
);

router.post(
  "/approve-driver/:id",
  isAuthorized,
  validateRequest(modelIdSchema, "params"),
  validateRequest(approveDeclineDriverSchema, "body"),
  approveDeclineDriverApplicationController
);

router.get(
  "/approve-driver-quick/:inspection_code",
  isAuthorized,
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

router.get(
  "/assigned-applications",
  isAuthorized,
  validateRequest(paginateSchema, "query"),
  fetchAssignedApplicationsController
);

router.get(
  "/view-a-driver/:id",
  isAuthorized,
  validateRequest(modelIdSchema, "params"),
  viewADriverController
);

router.get(
  "/validate/:token",
  validateRequest(validateTokenSchema, 'params'),
  validateTokenController,
);

router.get(
  "/get-sharp-cars",
  isAuthorized,
  validateRequest(getSharpCarsSchema, 'query'),
  getAssignedSharpCarsController,
);

router.put(
  "/mark-cars-as-delivered-successfully/:id",
  isAuthorized,
  validateRequest(modelIdSchema, "params"),
  markCarsAsDeliveredController,
);

router.get(
  "/fetch-private-sharp-cars",
  isAuthorized,
  validateRequest(paginateHubCarsSchema, "query"),
  fetchCarsFromCarOwnersForInspectionController,
);

router.put(
  "/inspect-sharp-private/:id",
  isAuthorized,
  validateRequest(modelIdSchema, "params"),
  validateRequest(inspectSharpPrivateCarSchema, "query"),
  inspectSharpPrivateCarController,
);


module.exports = router;
