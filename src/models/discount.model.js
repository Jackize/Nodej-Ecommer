'use strict'

const { model, Schema, Types } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
// Declare the Schema of the Mongo model
var discountSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 120
        },
        description: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['fixed_amount', 'percentage'],
            default: 'fixed_amount'
        },
        value: {
            type: Number,
            required: true
        },
        code: {
            // mã giảm giá
            type: String,
            required: true,
            unique: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        maxUses: {
            // số lượng mã giảm giá tối đa
            type: Number,
            required: true
        },
        usesCount: {
            // số lượng mã giảm giá đã sử dụng
            type: Number,
            required: true
        },
        usersUsed: {
            // danh sách người dùng đã sử dụng mã giảm giá
            type: [Types.ObjectId],
            ref: 'User',
            default: []
        },
        minOrderValue: {
            // giá trị đơn hàng tối thiểu
            type: Number,
            required: true
        },
        maxUsesPerUser: {
            // số lượng mã giảm giá tối đa mỗi người
            type: Number,
            required: true
        },
        shopId: {
            // id cửa hàng
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true
        },
        isActive: {
            // trạng thái mã giảm giá
            type: Boolean,
            default: true,
            index: true,
            select: false
        },
        applyFor: {
            // áp dụng cho
            type: String,
            required: true,
            enum: ['all', 'specific', 'exclude'],
            default: 'all'
        },
        productIds: {
            // danh sách sản phẩm áp dụng
            type: [Types.ObjectId],
            ref: 'Product',
            default: []
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

// index
discountSchema.index({ name: 'text', description: 'text', code: 'text', isActive: 1 })

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema)
