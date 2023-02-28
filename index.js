const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//const fs = require("fs");
const { createServer } = require("http");
//const redis = require("./redis");
// const cors = require("cors");

// const userRoutes = require("./routes/user");
// const chats = require("./routes/chats");
const app = require("./app");

const { fnConsumerUserCreate } = require("./queues/consumers");
const { startConsumer } = require("./queues/index");

const config_env = require("./config_env");
const { messaging } = require("./helpers/constants");

//const app = express();

const httpServer = createServer(app);

dotenv.config();

mongoose
  .connect(config_env.MONGO_URI, {
    useNewUrlParser: true,
    //useUnifiedTopology: true
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => {
    console.log(err);
  });

mongoose.connection.on("error", (err) => {
  console.log(`error messages ${err.message}`);
});

startConsumer(messaging.HUB_SERVICE_CREATE_USER, fnConsumerUserCreate);

app.use((err, req, res, next) => {
  if (err.name == "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  }
});

const port = config_env.PORT || 3003;
httpServer.listen(port);
console.log(`server is running on port ${port}`);
