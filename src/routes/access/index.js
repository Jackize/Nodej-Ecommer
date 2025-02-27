'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asynchHandler');
const { authenticattion } = require('../../auth/authUtils');
const router = express.Router();

//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp));

//signIn
router.post('/shop/signin', asyncHandler(accessController.signIn));

router.use(authenticattion);

//logout
router.post('/shop/logout', asyncHandler(accessController.logOut));
module.exports = router;