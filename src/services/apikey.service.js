'use strict'

const apikeyModel = require('../models/apikey.model')
const crypto = require('node:crypto')

class ApikeyService {
    static findById = async (key) => {
        // await apikeyModel.create({
        //     key: crypto.randomBytes(16).toString('hex'),
        //     permissions: ['0000']
        // })
        const objKey = await apikeyModel.findOne({ key, status: true }).lean()
        return objKey
    }
}

module.exports = ApikeyService
