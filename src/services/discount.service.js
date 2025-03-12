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

        if (new Date(startDate) > new Date(endDate)) {
            throw new BadRequestError('Start date or end date is invalid')
        }

        if (usesCount >= maxUses) {
            throw new BadRequestError('Max uses is invalid')
        }

        // check if code is already exists
        const foundDiscount = await findDiscountByCode(discountModel, {
            code,
            shopId: convertToObjectId(shopId)
        })

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

    /*
        Get all products with discount codes
    */
    static async getAllProductsWithDiscountCodes({ code, shopId, userId, limit, page }) {
        const foundDiscount = await findDiscountByCode(discountModel, {
            code,
            shopId: convertToObjectId(shopId),
            isActive: true
        })

        if (!foundDiscount) {
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

    /*
        Get all discount codes by shop
    */
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

    /*
        Apply discount code
    */
    static async getDiscountAmount({ code, userId, products, shopId }) {
        const foundDiscount = await findDiscountByCode(discountModel, {
            code,
            shopId: convertToObjectId(shopId),
            isActive: true
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found')
        }

        const {
            maxUses,
            maxUsesPerUser,
            usesCount,
            startDate,
            endDate,
            minOrderValue,
            usersUsed,
            ...rest
        } = foundDiscount

        if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Discount code is not active')
        }

        if (maxUses && usesCount >= maxUses) {
            throw new BadRequestError('Discount code is not active')
        }
        let totalPrice = 0

        if (!minOrderValue) {
            throw new BadRequestError('Min order value is not set')
        }

        if (minOrderValue > 0) {
            totalPrice = products.reduce(
                (acc, product) => acc + product.price * product.quantity,
                0
            )
        }

        if (totalPrice < minOrderValue) {
            throw new BadRequestError('Discount code is not active')
        }

        if (maxUsesPerUser && usersUsed.includes(userId)) {
            throw new BadRequestError('You have already used this discount code')
        }

        const amount = rest.applyFor === 'fixed' ? rest.value : (totalPrice * rest.value) / 100

        return {
            totalPrice,
            discount: amount,
            totalPriceAfterDiscount: totalPrice - amount
        }
    }

    static async deleteDiscountCode({ code, shopId }) {
        const foundDiscount = await findDiscountByCode(discountModel, {
            code,
            shopId: convertToObjectId(shopId)
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found')
        }

        await discountModel.findByIdAndDelete(foundDiscount._id)

        return foundDiscount
    }

    static async cancelDiscountCode({ code, shopId }) {
        const foundDiscount = await findDiscountByCode(discountModel, {
            code,
            shopId: convertToObjectId(shopId)
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found')
        }

        await discountModel.findByIdAndUpdate(foundDiscount._id, { isActive: false })
    }
}

module.exports = DiscountService
