'use trict'

'use strict'

const { model, Schema, Types } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'
// Declare the Schema of the Mongo model
var orderSchema = new Schema(
    {
        orderCheckout: {
            type: Object,
            default: {}
        },
        orderUserId: {
            type: Number,
            default: 1
        },
        orderShipping: {
            type: Object,
            default: {}
        },
        orderPayment: {
            type: Object,
            default: {}
        },
        orderProducts: {
            type: Object,
            default: {},
            required: true
        },
        trackingNumber: {
            type: String,
            required: false,
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema)
