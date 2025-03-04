'use strict';
const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// Define the product type = clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    timestamps: true,
    collection: 'Clothes'
})

// Define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: String,
    color: String,
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    timestamps: true,
    collection: 'Electronics'
})

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema)
};