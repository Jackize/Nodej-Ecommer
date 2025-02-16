"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECOND = 5000;
// count number of connections
const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log(`Number of connections: ${numConnect}`);
};

// check overload connection
const checkOverload = () => {
  setInterval(() => {
    const numConnect = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;

    console.log('Number of cores: ', numCores);
    console.log(`Memory usage: ${memoryUsage} MB`);
    
    const maxConnection = numCores * 5;
    if (numConnect > maxConnection) {
      console.log("Overload connection");
    }
  }, _SECOND);
};
module.exports = {
  countConnect,
  checkOverload,
};
