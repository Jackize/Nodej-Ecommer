'use strict'

const { NotFoundError } = require('../core/error.response')
const CommentModel = require('../models/comment.model')
const { findProduct } = require('../models/repositories/product.repo')
/*
    key features: comment services
    - add comment [User, Shop]
    - get list comment [User, Shop]
    - delete comment [User, Shop, Admin]
*/
class CommentService {
    static async createComment({ userId, productId, content, parentId = null }) {
        const comment = new CommentModel({ userId, productId, content, parentId })

        let rightValue = 0
        if (parentId) {
            // reply comment
            const parentComment = await CommentModel.findById(parentId)
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found')
            }
            rightValue = parentComment.right

            // update many comments
            await CommentModel.updateMany(
                { productId, right: { $gte: rightValue } },
                { $inc: { right: 2 } }
            )
        } else {
            // If it's a root comment, find the maximum right value for the product
            const maxRightValue = await CommentModel.findOne({ productId }).sort({ right: -1 })
            if (maxRightValue) {
                rightValue = maxRightValue.right + 1
            } else {
                rightValue = 1
            }
        }

        comment.left = rightValue
        comment.right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({ productId, parentId, limit = 50, offset = 0 }) {
        if (parentId) {
            const parent = await CommentModel.findById(parentId)
            if (!parent) throw new NotFoundError('Parent comment not found')

            const comments = await CommentModel.find({
                productId,
                right: { $lt: parent.right },
                left: { $gt: parent.left }
            })
                .select({
                    left: 1,
                    right: 1,
                    content: 1,
                    parentId: 1
                })
                .sort({ left: 1 })
                .limit(limit)
                .skip(offset)

            return comments
        }

        // If no parentId is provided, return root comments
        const comments = await CommentModel.find({
            productId,
            parentId
        })
            .select({
                left: 1,
                right: 1,
                content: 1,
                parentId: 1
            })
            .sort({ left: 1 })
            .limit(limit)
            .skip(offset)

        return comments
    }

    static async deleteComment({ commentId, productId }) {
        // check product is exist
        const foundProduct = await findProduct(productId)
        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }
        // check comment is exist
        const foundComment = await CommentModel.findById(commentId)
        if (!foundComment) {
            throw new NotFoundError('Comment not found')
        }

        const left = foundComment.left
        const right = foundComment.right
        const width = right - left + 1
        // delete comment
        await CommentModel.deleteMany(
            {
                _id: commentId
            },
            { left: { $gte: left, $lte: right } }
        )

        await CommentModel.updateMany({ right: { $gt: right } }, { $inc: { right: -width } })

        await CommentModel.updateMany({ left: { $gt: right } }, { $inc: { left: -width } })

        return { message: 'Comment deleted successfully' }
    }
}

module.exports = CommentService
