'use strict';

const { product, electronic, clothing, furniture } = require('../product.model');

const findAllDrafts = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const findAllPublished = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('shop', 'name email -_id')
        .sort({})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const publishProductByShop = async ({ shop, productId }) => {
    const foundShop = await product.findOne({
        shop,
        _id: productId
    })

    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;

}

const unPublishProductByShop = async ({ shop, productId }) => {
    const foundShop = await product.findOne({
        shop,
        _id: productId
    })

    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
}

const searchProducts = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch, 'i');
    const result = await product.find({
        isDraft: false,
        isPublished: true,
        $text: { $search: regexSearch }
    }, {
        score: { $meta: 'textScore' }
    })
        .sort({
            score: { $meta: 'textScore' }
        })
        .lean()
        .exec();

    return result;

}

module.exports = {
    findAllDrafts,
    publishProductByShop,
    findAllPublished,
    unPublishProductByShop,
    searchProducts
}
