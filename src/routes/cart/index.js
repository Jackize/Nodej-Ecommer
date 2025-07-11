'use strict'

const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart.controller')
const asyncHandler = require('../../helpers/asynchHandler')

// create cart
router.post('/', asyncHandler(cartController.createCart))

// update cart
router.put('/', asyncHandler(cartController.updateCart))

// delete cart
router.delete('/', asyncHandler(cartController.deleteCart))

// get list cart
router.get('/', asyncHandler(cartController.getListCart))

module.exports = router
