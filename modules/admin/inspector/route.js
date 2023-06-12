const { Router } = require("express");
const {multerUpload} = require('../../../config')
// const { auth } = require("../../isAuthenticated");
const { authTest, authorizeAdmin } = require("../../../middlewares/auth");
const { 
  addNewInspectorController,
  fetchInspectorByIdController,
  getAllInspectorsController,
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
  validateRequest(addNewInspectorSchema, 'body'),
  addNewInspectorController
);


router.get(
  "/get-one/:id",
  authorizeAdmin("All"), 
  validateRequest(modelIdSchema, 'params'),
  fetchInspectorByIdController
);

router.get(
  "/all",
  authorizeAdmin("All"), 
  validateRequest(paginateSchema, 'query'),
  getAllInspectorsController
);

router.get(
  "/view-inspected-cars/:id",
  authorizeAdmin("All"),
  validateRequest(modelIdSchema, 'params'),
  validateRequest(viewInspectedCarsSchema, 'query'),
  viewInspectedCarsController
);

module.exports = router;
