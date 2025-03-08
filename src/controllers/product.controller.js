'use strict'

const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxxx')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Create new product success!',
        //     metadata: await ProductService.createProduct(req.body.type, { ...req.body.payload, shop: req.user.userId })
        // }).send(res)
        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await ProductServiceV2.createProduct(req.body.type, {
                ...req.body.payload,
                shop: req.user.userId
            })
        }).send(res)
    }

    findAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductServiceV2.findAllDraftsForShop({ shop: req.user.userId })
        }).send(res)
    }

    findAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Published success!',
            metadata: await ProductServiceV2.findAllPublishedForShop({ shop: req.user.userId })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success!',
            metadata: await ProductServiceV2.publishProductByShop({
                shop: req.user.userId,
                productId: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product success!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                shop: req.user.userId,
                productId: req.params.id
            })
        }).send(res)
    }

    searchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search products success!',
            metadata: await ProductServiceV2.searchProducts({ keySearch: req.params.keySearch })
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list products success!',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product success!',
            metadata: await ProductServiceV2.findProduct({
                productId: req.params.productId
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update product success!',
            metadata: await ProductServiceV2.updateProduct(req.body.type, req.params.productId, {
                ...req.body.payload,
                shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController()
