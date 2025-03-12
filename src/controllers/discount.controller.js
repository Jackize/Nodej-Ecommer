'use strict'

const { SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount code created successfully',
            metadata: await DiscountService.createDiscount({ ...req.body, shopId: req.user.userId })
        }).send(res)
    }

    getAllProductsWithDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount amount retrieved successfully',
            metadata: await DiscountService.getAllProductsWithDiscountCodes({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount codes retrieved successfully',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.body
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount amount retrieved successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    deleteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount code deleted successfully',
            metadata: await DiscountService.deleteDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    cancelDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount code cancelled successfully',
            metadata: await DiscountService.cancelDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new DiscountController()
