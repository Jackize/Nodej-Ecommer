'use strict'

const { convertToObjectId, unSelectData, getSelectData } = require('../../utils')
const { discount } = require('../discount.model')

const findDiscountByCode = async ({ code, shopId }) => {
    return await discount
        .findOne({
            code,
            shopId: convertToObjectId(shopId)
        })
        .lean()
}

const findAllDiscountCodesUnSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
    model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unSelectData(unSelect))
        .lean()
}

const findAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
    model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
}

module.exports = {
    findDiscountByCode,
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect
}
