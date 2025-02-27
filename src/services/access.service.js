'use strict';
const shopModel = require('../models/shop.model');
const bycrypt = require('bcrypt');
const crypto = require('node:crypto');
const { createTokenPair } = require('../auth/authUtils');
const KeyTokenService = require('./keyToken.service');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        // check email exist
        const hodelShop = await shopModel.findOne({ email }).lean();
        if (hodelShop) {
            throw new BadRequestError('Email already exists');
        }

        const passwordHash = await bycrypt.hash(password, 10);
        const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] });

        if (newShop) {

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const keyStore = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey });

            if (!keyStore) {
                throw new Error('Error create key token');
            }
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
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

    static signIn = async ({ email, password, refreshToken }) => {
        // check email exist
        const hodelShop = await findByEmail({ email });
        if (!hodelShop) throw new BadRequestError('Shop not exists');

        // check password
        const match = await bycrypt.compare(password, hodelShop.password);
        if (!match) throw new AuthFailureError('Authentication error');

        // create token pair
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // get key token
        const tokens = await createTokenPair({ userId: hodelShop._id, email }, publicKey, privateKey);

        // save key token
        const keyStore = await KeyTokenService.createKeyToken({ userId: hodelShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken });
        if (!keyStore) {
            throw new Error('Error create key token');
        }
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: hodelShop }),
            tokens
        }
    }
}

module.exports = AccessService;