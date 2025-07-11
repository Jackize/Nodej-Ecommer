'use strict'

const express = require('express')
const router = express.Router()
const apiKeyController = require('../../controllers/apiKey.controller')
const asyncHandler = require('../../helpers/asynchHandler')

// create cart
router.post('/', asyncHandler(apiKeyController.createApiKey))

module.exports = router
