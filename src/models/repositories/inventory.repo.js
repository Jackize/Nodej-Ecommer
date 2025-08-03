'use strict'
const { convertToObjectId } = require('../../utils')
const { inventory } = require('../inventory.model')

const insertInventory = async ({ productId, stock, shopId, location = 'unKnow' }) => {
    return await inventory.create({ productId, stock, shopId, location })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
            productId: convertToObjectId(productId),
            stock: { $gte: quantity }
        },
        updateSet = {
            $inc: { stock: -quantity },
            $push: { reservation: { quantity, cartId, createOn: new Date() } }
        },
        options = {
            upsert: true,
            new: true
        }

    return await inventory.updateOne(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}
