'use strict'

const findCartOrCreate = async ({ userId, products }) => {
    const foundCart = await cartModel.findOne({ userId })
    if (foundCart) return foundCart
    const newCart = await cartModel.create({ userId, products })
    return newCart
}

module.exports = {
    findCartOrCreate
}
