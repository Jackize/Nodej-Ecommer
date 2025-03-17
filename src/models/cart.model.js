'use strict'

const { model, Schema, Types } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'
// Declare the Schema of the Mongo model
var cartSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        products: {
            type: Array,
            required: true,
            default: []
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema)
