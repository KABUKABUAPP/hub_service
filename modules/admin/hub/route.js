const { Router } = require("express");
const {multerUpload} = require('../../../config')
// const { auth } = require("../../isAuthenticated");
const { authTest } = require("../../../middlewares/auth");
const { 
  addNewHubController,
  fetchHubByIdController,
  getAllHubsController
 } = require("./controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { 
  addNewInspectorSchema,
  modelIdSchema,
  paginateSchema
} = require("./schema");

const router = Router();

router.post(
  "/add-new",
  //  authTest, 
  multerUpload.array('hub_images'),
  addNewHubController
);


router.get(
  "/get-one/:id",
  //  authTest, 
  validateRequest(modelIdSchema, 'params'),
  fetchHubByIdController
);

router.get(
  "/all",
  //  authTest, 
  validateRequest(paginateSchema, 'query'),
  getAllHubsController
);

module.exports = router;
