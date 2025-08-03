'use strict'

const cartModel = require('../cart.model')

const findCartOrCreate = async ({ userId, products }) => {
    const foundCart = await cartModel.findOne({ userId })
    if (foundCart) return foundCart
    const newCart = await cartModel.create({ userId, products })
    return newCart
}

const findCartById = async (cartId) => {
    return await cartModel.findOne({ _id: cartId, status: 'active' }).lean()
}

module.exports = {
    findCartOrCreate,
    findCartById
}
