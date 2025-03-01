'use strict'
const shopModel = require('../models/shop.model')
const bycrypt = require('bcrypt')
const crypto = require('node:crypto')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const KeyTokenService = require('./keyToken.service')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const ShopService = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    // Check this token is used
    static handleRefreshToken = async (refreshToken) => {
        // check token is used
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        // check token is exist
        if (foundToken) {
            // decode token
            const { userId } = await verifyJWT(refreshToken, foundToken.privateKey)
            // delete token
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happened !! Please re-login')
        }
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Something wrong happened !! Please re-login')
        // verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)

        const foundShop = await ShopService.findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not exists')

        // create token pair
        const tokens = await createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        )

        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static handleRefreshTokenV2 = async (req) => {
        const { userId, email } = req.user
        // check token is used in refreshTokensUsed
        if (req.keyStore.refreshTokensUsed.includes(req.refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happened !! Please re-login')
        }
        // compare refreshToken
        if (req.keyStore.refreshToken !== req.refreshToken)
            throw new AuthFailureError('Invalid token')

        const foundShop = await ShopService.findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not exists')

        // create token pair
        const tokens = await createTokenPair(
            { userId, email },
            req.keyStore.publicKey,
            req.keyStore.privateKey
        )

        // update token
        await req.keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: req.refreshToken
            }
        })

        return {
            user: { userId, email },
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // check email exist
        const foundShop = await shopModel.findOne({ email }).lean()
        if (foundShop) {
            throw new BadRequestError('Email already exists')
        }

        const passwordHash = await bycrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                throw new Error('Error create key token')
            }
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            )
            return {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }

    static signIn = async ({ email, password }) => {
        // check email exist
        const foundShop = await ShopService.findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not exists')

        // check password
        const match = await bycrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        // create token pair
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // get key token
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        )

        // save key token
        const keyStore = await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })
        if (!keyStore) {
            throw new Error('Error create key token')
        }
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static logOut = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }
}

module.exports = AccessService
