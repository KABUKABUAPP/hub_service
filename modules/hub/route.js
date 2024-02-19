const { Router } = require("express");

// const { auth } = require("../../isAuthenticated");
const { authTest } = require("../../middlewares/auth");
const { 
  fetchUser, 
  fetchUserById, 
  fetchHubsByLocationController, 
  fetchAssignedHubDetailsController,
  fetchHubByIdController
} = require("./controller");
const validateRequest = require("../../middlewares/validateRequest");
const { fetchHubByLocationSchema, modelIdSchema } = require("./schema");

const router = Router();

// router.get("/fetch-user", authTest, fetchUser);
// router.get("/fetch-user/:userId", fetchUserById);
router.get(
  "/fetch",
  validateRequest(fetchHubByLocationSchema, "query"),
  fetchHubsByLocationController
);

router.get(
  "/assigned/:id",
  validateRequest(modelIdSchema, "params"),
  fetchAssignedHubDetailsController
);

router.get(
  "/fetch-by-id/:id",
  validateRequest(modelIdSchema, "params"),
  fetchHubByIdController
);

module.exports = router;
