'use strict';
const jwt = require('jsonwebtoken');
const asyncHandler = require('../helpers/asynchHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');
const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    const accessToken = await jwt.sign(payload, publicKey, {
        expiresIn: '2 days'
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
        expiresIn: '7 days'
    });
    return { accessToken, refreshToken };
}

const authenticattion = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid request');

    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found key store');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid request');

    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
        req.keyStore = keyStore;
        next();
    } catch (error) {
        throw error
    }
});

module.exports = {
    createTokenPair,
    authenticattion
}
