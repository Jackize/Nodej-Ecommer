'use strict'
const { BadRequestError } = require('../core/error.response')
const inventoryModel = require('../models/inventory.model')
const { findProductById } = require('../models/repositories/product.repo')

class InventoryService {
    static async addStockToInventory({ stock, productId, shopId, location = 'default' }) {
        const product = await findProductById(productId)
        if (!product) {
            throw new BadRequestError('Product not found')
        }
        const query = {
                shopId,
                productId
            },
            updateSet = {
                $inc: { stock: stock },
                $set: { location }
            },
            options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        const updatedInventory = await inventoryModel.findOneAndUpdate(query, updateSet, options)
        if (!updatedInventory) {
            throw new BadRequestError('Failed to update inventory')
        }
        return updatedInventory
    }
}

module.exports = InventoryService