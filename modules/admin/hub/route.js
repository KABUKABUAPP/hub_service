const { Router } = require("express");
const {multerUpload} = require('../../../config')
// const { auth } = require("../../isAuthenticated");
const { authTest, authorizeAdmin } = require("../../../middlewares/auth");
const { 
  addNewHubController,
  fetchHubByIdController,
  getAllHubsController,
  viewInspectedCarsController
 } = require("./controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { 
  addNewInspectorSchema,
  modelIdSchema,
  paginateSchema,
  viewInspectedCarsSchema
} = require("./schema");

const router = Router();

router.post(
  "/add-new",
  authorizeAdmin("All"),
  multerUpload.array('hub_images'),
  addNewHubController
);


router.get(
  "/get-one/:id",
  authorizeAdmin("All"),
  validateRequest(modelIdSchema, 'params'),
  fetchHubByIdController
);

router.get(
  "/all",
  authorizeAdmin("All"),
  validateRequest(paginateSchema, 'query'),
  getAllHubsController
);

router.get(
  "/all",
  authorizeAdmin("All"),
  validateRequest(paginateSchema, 'query'),
  getAllHubsController
);

router.get(
  "/view-inspected-cars/:id",
  authorizeAdmin("All"),
  validateRequest(modelIdSchema, 'params'),
  validateRequest(viewInspectedCarsSchema, 'query'),
  viewInspectedCarsController
);


module.exports = router;
