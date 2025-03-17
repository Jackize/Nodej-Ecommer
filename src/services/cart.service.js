'use strict'
const { NotFoundError } = require('../core/error.response')
const cartModel = require('../models/cart.model')
const { findProductById } = require('../models/repositories/product.repo')

class CartService {
    static async createCart({ userId, products }) {
        const query = { userId, status: true },
            updateOrInsert = { $setOnInsert: { products } },
            options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = { userId, 'products.productId': productId, status: true },
            update = { $inc: { 'products.$.quantity': quantity } },
            options = { new: true }
        return await cartModel.findOneAndUpdate(query, update, options)
    }

    static async addToCart({ userId, product = {} }) {
        const foundCart = await cartModel.findOne({ userId })
        if (!foundCart) {
            return await this.createCart({ userId, products: [product] })
        }
        // if cart is empty, add product to cart
        if (foundCart.products.length === 0) {
            foundCart.products = [product]
            return await foundCart.save()
        }
        // if cart is not empty, update product quantity
        return await this.updateCartQuantity({
            userId,
            product: { productId: product.productId, quantity: product.quantity }
        })
    }

    static async addToCartOptimisticLock({ userId, product = {} }) {
        const { productId, quantity, oldQuantity } = shopOrderIds[0]?.itemProducts[0]
        // found product
        const foundProduct = await findProductById({ productId })
        if (!foundProduct) {
            throw new NotFoundError('Product not found')
        }
        if (foundProduct.shop.toString() !== shopOrderIds[0].shop) {
            throw new NotFoundError('Product does not match')
        }
        if (quantity === 0) {
            // delete
        }
        // update quantity
        return await updateCartQuantity({
            userId,
            product: { productId, quantity: quantity - oldQuantity }
        })
    }
}

module.exports = CartService
