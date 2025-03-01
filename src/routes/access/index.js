'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asynchHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

//signIn
router.post('/shop/signin', asyncHandler(accessController.signIn))

router.use(authenticationV2)

//logout
router.post('/shop/logout', asyncHandler(accessController.logOut))

//handleRefreshToken
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

module.exports = router
