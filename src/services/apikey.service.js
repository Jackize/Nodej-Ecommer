'use strict'

const { BadRequestError } = require('../core/error.response')
const apiKeyModel = require('../models/apikey.model')
const crypto = require('node:crypto')

class ApiKeyService {
    static createApiKey = async (permissions) => {
        if (!permissions) throw new BadRequestError('Permissions are required')
        const key = crypto.randomBytes(16).toString('hex')
        const objKey = await apiKeyModel.create({
            key,
            permissions
        })
        return objKey
    }

    static findById = async (key) => {
        const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
        return objKey
    }
}

module.exports = ApiKeyService
