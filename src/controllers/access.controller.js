'use strict'

const { Created, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
    signIn = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login OK!',
            metadata: await AccessService.signIn(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new Created({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }

    logOut = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout OK!',
            metadata: await AccessService.logOut(req.keyStore)
        }).send(res)
    }

    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res)
    }
}

module.exports = new AccessController()
