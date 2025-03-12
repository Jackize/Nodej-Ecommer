'use strict'

const { model, Schema, Types } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        stock: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            default: 'unKnow'
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop'
        },
        reservation: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}
