const config = require('../../config');

import Schema from 'validate'


const user = new Schema({
    age: {
        type: Number,
        required: false,
    },
    email: {
        type: String,
        match: config.regex.email,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        enum: [config.roles.admin, config.roles.user],
    },
    isLive: {
        type: Boolean,
        required: false,

    },

    resetCredentials: {
        type: Boolean,
        required: false,
        default: false,
    },


})

module.exports = user
