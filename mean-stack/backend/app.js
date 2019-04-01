const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();
const path = require("path");

mongoose
  .connect(
    "mongodb+srv://Swapnil:9ivsuepEmov9db8n@cluster0-dqrjx.mongodb.net/ndoe-angular"
  )
  .then(() => {
    console.log("connected to database"); //connection established.
  })
  .catch(() => {
    console.log("connection Failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/images", express.static(path.join("backend/images"))); // stored images on this path
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;