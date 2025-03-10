'use strict'
const { inventory } = require("../inventory.model")

const insertInventory = async ({ productId, stock, shopId, location = 'unKnow' }) => {
    return await inventory.create({ productId, stock, shopId, location })
}

module.exports = {
    insertInventory
}
