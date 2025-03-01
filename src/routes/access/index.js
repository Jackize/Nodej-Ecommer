'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asynchHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))

//signIn
router.post('/shop/signin', asyncHandler(accessController.signIn))

router.use(authentication)

//logout
router.post('/shop/logout', asyncHandler(accessController.logOut))

//handleRefreshToken
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

module.exports = router
