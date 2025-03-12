'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const asyncHandler = require('../../helpers/asynchHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

//get all products with discount codes
router.get(
    '/getAllProductsWithDiscountCodes',
    asyncHandler(discountController.getAllProductsWithDiscountCodes)
)

//get all discount codes by shop
router.get('/getAllDiscountCodesByShop', asyncHandler(discountController.getAllDiscountCodesByShop))

//get discount amount
router.get('/getDiscountAmount', asyncHandler(discountController.getDiscountAmount))

router.use(authenticationV2)

//create discount code
router.post('/create', asyncHandler(discountController.createDiscountCode))

//delete discount code
router.post('/delete', asyncHandler(discountController.deleteDiscountCode))

//cancel discount code
router.post('/cancel', asyncHandler(discountController.cancelDiscountCode))

module.exports = router
