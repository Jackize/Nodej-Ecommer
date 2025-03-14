'use strict'
require('dotenv').config()

const dev = {
    app: {
        port: process.env.PORT
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME
    }
}

const prod = {
    app: {
        port: process.env.PORT
    },
    db: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        name: process.env.PROD_DB_NAME
    }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]
