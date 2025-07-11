'use strict'

const { Created, SuccessResponse } = require('../core/success.response')
const ApiKeyService = require('../services/apiKey.service')

class ApiKeyController {
    createApiKey = async (req, res, next) => {
        new Created({
            message: 'Create API Key Success',
            metadata: await ApiKeyService.createApiKey(req.body.permissions)
        }).send(res)
    }
}

module.exports = new ApiKeyController()
