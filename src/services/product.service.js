'use strict';

const { product, electronic, clothing } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
// define Factory class to create products
class ProductFactory {
    /*
    type: 'Clothing'
    payload: {
        name: 'Product 1',
        thumbnail: 'https://via.placeholder.com/150',
        description: 'Product 1 description',
        price: 100,
        quantity: 100,
    }
    */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return new Clothing(payload).createProduct();
            case 'Electronic':
                return new Electronic(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid product type: ${type}`);
        }
    }
}

// define base product class
class Product {
    constructor({
        name,
        thumbnail,
        description,
        price,
        quantity,
        type,
        shop,
        attributes
    }) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.type = type;
        this.shop = shop;
        this.attributes = attributes;
    }

    async createProduct() {
        return await product.create(this);
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.attributes)
        if (!newClothing) throw new BadRequestError('Create new clothing error');

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError('Create new product error');
        return newProduct;
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.attributes)
        if (!newElectronic) throw new BadRequestError('Create new electronic error');

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError('Create new product error');
        return newProduct;
    }
}

module.exports = ProductFactory;
