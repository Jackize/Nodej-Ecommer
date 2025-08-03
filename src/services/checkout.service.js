'use strict'

const { BadRequestError } = require('../core/error.response')
const { findCartById } = require('../models/repositories/cart.repo')
const { checkProductsExist } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')
const orderModel = require('../models/order.model')
const cartModel = require('../models/cart.model')
class CheckoutService {
    /*
    {
        cartId: 'cart123',
        userId: 'user123',
        shop_order_ids: [
            {
                shopId: 'shop123',
                shop_discounts: [{ code: 'DISCOUNT10' }],
                item_products: [
                    {
                        productId: 'product123,
                        quantity: 2,
                        price: 100
                    }
                ]
            }
        ]

    }
    */
    static async checkoutReview({ userId, cartId, shop_order_ids = [] }) {
        if (!userId || !cartId) {
            throw new BadRequestError('User ID and Cart ID are required')
        }

        // Validate cartId
        const foundCart = await findCartById(cartId)

        if (!foundCart) {
            throw new BadRequestError('Cart not found or inactive')
        }
        const checkout_order = {
                totalPrice: 0,
                feeShip: 0,
                totalDiscount: 0,
                totalCheckout: 0
            },
            shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            // check product availability
            if (!shopId || !item_products || item_products.length === 0) {
                throw new BadRequestError('Invalid shop order data')
            }
            // check products exist
            const checkProduct = await checkProductsExist(item_products)
            if (!checkProduct[0]) throw new BadRequestError('Order wrong!!!')

            // calculate total price for this shop
            const checkoutPrice = checkProduct.reduce((total, item) => {
                return total + item.price * item.quantity
            }, 0)
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkout_order.totalPrice,
                priceAppliedDiscount: checkout_order.totalPrice,
                item_products: checkProduct
            }

            // Kiem tra discount
            if (shop_discounts && shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    code: shop_discounts[0].code,
                    userId,
                    products: checkProduct,
                    shopId
                })

                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceAppliedDiscount = checkoutPrice - discount
                }

                checkout_order.totalPrice += itemCheckout.priceAppliedDiscount
                shop_order_ids_new.push(itemCheckout)
            }
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        const products = shop_order_ids_new.flatMap((order) => order.item_products)
        const acquireProduct = []
        for (const product of products) {
            const { productId, quantity } = product
            const isLocked = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(isLocked ? true : false)
            if (isLocked) {
                await releaseLock(isLocked)
            }
        }

        // Check if one of the products could not be locked
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Some products are not available for checkout')
        }

        const newOrder = await orderModel.create({
            orderCheckout: checkout_order,
            orderUserId: userId,
            orderShipping: user_address,
            orderPayment: user_payment,
            orderProducts: shop_order_ids_new
        })

        // Remove product order success from cart
        if (newOrder) {
            // await cartModel.removeProducts(cartId, shop_order_ids_new.map(order => order.shopId));
        }

        return newOrder
    }

    /*
     Query order User [User]
    */
    static async getOrderByUser() {}

    /*
     Query order by orderID [id]
    */
    static async getOrderByOrderId() {}
}

module.exports = CheckoutService
