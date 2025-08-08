'use strict'

const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/comment.controller')
const asyncHandler = require('../../helpers/asynchHandler')

// create comment
router.post('/', asyncHandler(commentController.createComment))
// get comments by parentId
router.get('/', asyncHandler(commentController.getCommentsByParentId))
// delete comment by id
router.delete('/', asyncHandler(commentController.deleteCommentById))

module.exports = router
