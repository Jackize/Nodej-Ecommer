'use strict'

const express = require('express')
const router = express.Router()
const inventoryController = require('../../controllers/inventory.controller')
const asyncHandler = require('../../helpers/asynchHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)
// create inventory 
router.post('/', asyncHandler(inventoryController.addStock))

module.exports = router
