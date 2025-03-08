'use strict'

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 1]))
}

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 0]))
}

const removeUndefinedObject = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
    )
}

const updateNestedObjectParser = (obj) => {
    const final = {}
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const res = updateNestedObjectParser(obj[key])
            Object.keys(res).forEach((item) => {
                final[`${key}.${item}`] = res[item]
            })
        } else {
            if (obj[key] !== null && obj[key] !== undefined) {
                final[key] = obj[key]
            }
        }
    })
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}
