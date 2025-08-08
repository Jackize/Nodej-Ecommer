'use strict'

const CommentService = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')
class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Comment created successfully',
            metadata: await CommentService.createComment({
                ...req.body
            })
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Comments retrieved successfully',
            metadata: await CommentService.getCommentsByParentId({
                ...req.query
            })
        }).send(res)
    }

    deleteCommentById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Comment deleted successfully',
            metadata: await CommentService.deleteCommentById(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()
