'use strict'

const { model, Schema, Types } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'
// Declare the Schema of the Mongo model
var commentSchema = new Schema(
    {
        productId: {
            type: Types.ObjectId,
            ref: 'Product',
            required: true
        },
        userId: {
            type: Number,
            default: 1
        },
        content: {
            type: String,
            default: 'test'
        },
        left: {
            type: Number,
            default: 0,
            min: 0
        },
        right: {
            type: Number,
            default: 0,
            min: 0
        },
        parentId: {
            type: Types.ObjectId,
            ref: DOCUMENT_NAME
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema)
