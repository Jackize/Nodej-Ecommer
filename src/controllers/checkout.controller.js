'use strict'

const CommentService = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')
class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Checkout review created successfully',
            metadata: await CheckoutService.checkoutReview({
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new CheckoutController()
