'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');

// define routes
router.post('/', productController.createProduct);

module.exports = router;
