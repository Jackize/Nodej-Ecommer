'use strict'

const redis = require('redis')
const redisClient = redis.CreateClient()
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnx = promisify(redisClient.setnx).bind(redisClient)
const delAsyncKey = promisify(redisClient.del).bind(redisClient)

const acquireLock = async (productId, updateCartQuantity, cartId) => {
    const key = `lock_v2025_${productId}`
    const retryTimes = 10
    const expireTime = 3000 // 3 seconds tam lock

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnx(key, expireTime)
        if (result === 1) {
            // Lock acquired
            const isReservation = await reservationInventory({
                productId,
                quantity: updateCartQuantity,
                cartId
            })
            if (isReservation.modifiedCount > 0) {
                console.log(`Lock acquired for product ${productId} with cart ${cartId}`)
                await pexpire(key, expireTime / 1000) // Set expiration time in seconds
                return key
            }
            return null
        } else {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 100))
        }
    }
}

const releaseLock = async (keyLock) => {
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}
