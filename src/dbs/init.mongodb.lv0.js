"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/shopdev";

mongoose
  .connect(connectString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

if(1==1) {
    mongoose.set("debug", true);
}

module.exports = mongoose;