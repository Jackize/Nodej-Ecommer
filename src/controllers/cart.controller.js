'use strict'

const CartService = require('../services/cart.service')
const { SuccessResponse } = require('../core/success.response')
class CartController {
    createCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart created successfully',
            metadata: await CartService.createCart({
                ...req.body
            })
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart updated successfully',
            metadata: await CartService.addToCartOptimisticLock({
                ...req.body
            })
        }).send(res)
    }

    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart deleted successfully',
            metadata: await CartService.deleteUserCart({
                ...req.body
            })
        }).send(res)
    }

    getListCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Cart list retrieved successfully',
            metadata: await CartService.getListUserCart({
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new CartController()
