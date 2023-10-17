const { Router } = require("express");
const {multerUpload} = require('../../../config')
// const { auth } = require("../../isAuthenticated");
const { authTest, authorizeAdmin } = require("../../../middlewares/auth");
const { 
  addNewHubController,
  fetchHubByIdController,
  getAllHubsController,
  viewInspectedCarsController,
  removeHubController
 } = require("./controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { 
  addNewInspectorSchema,
  modelIdSchema,
  paginateSchema,
  viewInspectedCarsSchema
} = require("./schema");
const { adminPermissions, readWrtie } = require("../../../helpers/constants");

const router = Router();

router.post(
  "/add-new",
  authorizeAdmin(adminPermissions.HUBS, readWrtie.WRITE),
  multerUpload.array('hub_images'),
  addNewHubController
);


router.get(
  "/get-one/:id",
  authorizeAdmin(adminPermissions.HUBS, readWrtie.READ),
  validateRequest(modelIdSchema, 'params'),
  validateRequest(paginateSchema, 'query'),
  fetchHubByIdController
);

router.get(
  "/all",
  authorizeAdmin(adminPermissions.HUBS, readWrtie.READ),
  validateRequest(paginateSchema, 'query'),
  getAllHubsController
);

router.get(
  "/all",
  authorizeAdmin(adminPermissions.HUBS, readWrtie.READ),
  validateRequest(paginateSchema, 'query'),
  getAllHubsController
);

router.get(
  "/view-inspected-cars/:id",
  authorizeAdmin(adminPermissions.HUBS, readWrtie.READ),
  validateRequest(modelIdSchema, 'params'),
  validateRequest(viewInspectedCarsSchema, 'query'),
  viewInspectedCarsController
);

router.put(
  "/delete-one/:id",
  authorizeAdmin(adminPermissions.HUBS, readWrtie.WRITE),
  validateRequest(modelIdSchema, 'params'),
  removeHubController
);


module.exports = router;
