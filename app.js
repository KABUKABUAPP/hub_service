const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const initializeRoutes = require("./routes");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for the end-points
initializeRoutes(app);

app.use((err, req, res, next) => {
  if (err.name == "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = app;
