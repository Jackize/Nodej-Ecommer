'use strict';

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId }, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }, options = { upsert: true, new: true };
            const tokens = await keytokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: userId }).lean();
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id });
    }
}

module.exports = KeyTokenService;