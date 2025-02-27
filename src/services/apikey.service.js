'use strict';

const apikeyModel = require("../models/apikey.model");
const crypto = require('node:crypto');

class ApikeyService {
    static findById = async (key) => {
        const objKey = await apikeyModel.findOne({ key, status: true }).lean();
        return objKey;
    }
}

module.exports = ApikeyService;