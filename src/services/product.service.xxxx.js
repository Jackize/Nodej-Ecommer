'use strict';

const { product, electronic, clothing, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const { findAllDrafts, publishProductByShop, findAllPublished, unPublishProductByShop, searchProducts } = require('../models/repositories/product.repo');
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
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);
        return new productClass(payload).createProduct();
    }

    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    // Put
    static async publishProductByShop({ shop, productId }) {
        return await publishProductByShop({ shop, productId });
    }

    static async unPublishProductByShop({ shop, productId }) {
        return await unPublishProductByShop({ shop, productId });
    }

    // Query
    static async findAllDraftsForShop({ shop, limit = 50, skip = 0 }) {
        const query = { shop, isDraft: true };
        return await findAllDrafts({ query, limit, skip });
    }

    static async findAllPublishedForShop({ shop, limit = 50, skip = 0 }) {
        const query = { shop, isPublished: true };
        return await findAllPublished({ query, limit, skip });
    }

    static async searchProducts({ keySearch }) {
        return await searchProducts({ keySearch });
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

    async createProduct(id) {
        return await product.create({ ...this, _id: id });
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({ ...this.attributes, shop: this.shop })
        if (!newClothing) throw new BadRequestError('Create new clothing error');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Create new product error');
        return newProduct;
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ ...this.attributes, shop: this.shop })
        if (!newElectronic) throw new BadRequestError('Create new electronic error');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Create new product error');
        return newProduct;
    }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ ...this.attributes, shop: this.shop })
        if (!newFurniture) throw new BadRequestError('Create new furniture error');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Create new product error');
        return newProduct;
    }
}

ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
