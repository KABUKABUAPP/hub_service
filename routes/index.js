const { Router } = require("express");
const inspectorRoute = require("../modules/inspector/route");
const hubRoute = require("../modules/hub/route");
const adminHubRoutes = require('../modules/admin/hub/route')
const adminInspectorRoutes = require('../modules/admin/inspector/route')


module.exports = (app) => {

  // app.use("/auth", authRoute);
  // app.use("/user", userRoute);





  //ADMIN ROUTES
  app.use("/admin/hub", adminHubRoutes);
  app.use("/admin/inspector", adminInspectorRoutes);


  app.get("/", (req, res) => {
    res.send("server working");
  });
};
