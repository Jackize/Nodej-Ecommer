'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const discountModel = require('../models/discount.model')
/*
Discount Service
1- Tạo mã giảm giá [Shop | Admin]
2- Get discount amount [User]
3- Get all discount codes [User | Shop]
4- Verify discount code [User]
5- Delete discount code [Shop | Admin]
6- Cancel discount code [User]
*/

const { discount } = require('../models/discount.model')
const {
    findDiscountByCode,
    findAllDiscountCodesUnSelect
} = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectId } = require('../utils')

class DiscountService {
    static createDiscount = async (payload) => {
        const {
            code,
            startDate,
            endDate,
            isActive,
            shopId,
            minOrderValue,
            productIds,
            name,
            description,
            type,
            value,
            applyFor,
            maxUses,
            usesCount,
            maxUsesPerUser
        } = payload

        if (
            new Date() > new Date(startDate) ||
            new Date() > new Date(endDate) ||
            new Date(startDate) > new Date(endDate)
        ) {
            throw new BadRequestError('Start date or end date is invalid')
        }

        if (usesCount >= maxUses) {
            throw new BadRequestError('Max uses is invalid')
        }

        // check if code is already exists
        const foundDiscount = await findDiscountByCode({ code, shopId })

        if (foundDiscount && discount.isActive) {
            throw new BadRequestError('Discount code already exists')
        }

        return await discountModel.create({
            ...payload,
            shopId: convertToObjectId(shopId),
            minOrderValue: Number(minOrderValue) || 0,
            value: Number(value) || 0,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            usesCount: Number(usesCount) || 0,
            productIds: applyFor === 'all' ? [] : productIds.map(convertToObjectId)
        })
    }

    static async updateDiscountCode() {}

    static async getAllProductsWithDiscountCodes({ code, shopId, userId, limit, page }) {
        const foundDiscount = await findDiscountByCode({ code, shopId })

        if (!foundDiscount || !foundDiscount.isActive) {
            throw new NotFoundError('Discount code not found')
        }

        const { applyFor, productIds, ...rest } = foundDiscount

        let products = []
        if (applyFor === 'all') {
            products = await findAllProducts({
                limit,
                page,
                filter: { isDraft: false, isPublished: true, shop: convertToObjectId(shopId) },
                select: ['name']
            })
        }
        if (applyFor === 'specific') {
            if (productIds.length !== 0) {
                products = await findAllProducts({
                    limit,
                    page,
                    filter: {
                        isDraft: false,
                        isPublished: true,
                        shop: convertToObjectId(shopId),
                        _id: { $in: productIds }
                    },
                    select: ['name']
                })
            }
        }

        return {
            ...rest,
            products
        }
    }

    static async getAllDiscountCodesByShop({ shopId, limit, page }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit,
            page,
            filter: { shopId: convertToObjectId(shopId), isActive: true },
            unSelect: ['__v'],
            model: discountModel
        })

        return discounts
    }
}

module.exports = new DiscountService()
