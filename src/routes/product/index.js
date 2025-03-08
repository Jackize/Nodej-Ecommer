'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asynchHandler')
const { authenticationV2 } = require('../../auth/authUtils')

// search product
router.get('/search/:keySearch', asyncHandler(productController.searchProducts))

// get list products
router.get('', asyncHandler(productController.findAllProducts))

// get product
router.get('/:productId', asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2)

// create product
router.post('/', asyncHandler(productController.createProduct))

// get list draft
router.get('/drafts/all', asyncHandler(productController.findAllDraftsForShop))

// publish product
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))

// unpublish product
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// get list published
router.get('/published/all', asyncHandler(productController.findAllPublishedForShop))

// update product
router.patch('/:productId', asyncHandler(productController.updateProduct))

module.exports = router
