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
  viewInspectedCarsSchema,
  validateTokenSchema
} = require("./schema");
const { adminPermissions, readWrtie } = require("../../../helpers/constants");
const { validateTokenController } = require("../../inspector/controller");

const router = Router();

router.post(
  "/add-new",
  authorizeAdmin(adminPermissions.INSPECTORS, readWrtie.WRITE), 
  validateRequest(addNewInspectorSchema, 'body'),
  addNewInspectorController
);


router.get(
  "/get-one/:id",
  authorizeAdmin(adminPermissions.INSPECTORS, readWrtie.READ), 
  validateRequest(modelIdSchema, 'params'),
  fetchInspectorByIdController
);

router.get(
  "/all",
  authorizeAdmin(adminPermissions.INSPECTORS, readWrtie.READ), 
  validateRequest(paginateSchema, 'query'),
  getAllInspectorsController
);

router.get(
  "/view-inspected-cars/:id",
  authorizeAdmin(adminPermissions.INSPECTORS, readWrtie.READ), 
  validateRequest(modelIdSchema, 'params'),
  validateRequest(viewInspectedCarsSchema, 'query'),
  viewInspectedCarsController
);



module.exports = router;
