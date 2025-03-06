'use strict';
const { Schema, model, Types } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
    },
    slug: String,
    isDraft: {
        type: Boolean,
        default: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        select: false
    },
    rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    variations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
// index
productSchema.index({ name: 'text', description: 'text' });
// Document middleware: runs before .save() and .create()...
productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
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

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    material: String,
    size: String,
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    timestamps: true,
    collection: 'Furniture'
})

//Export the model
module.exports = {
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
    product: model(DOCUMENT_NAME, productSchema)
};