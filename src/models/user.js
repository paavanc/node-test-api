const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const User = new Schema(
    {
        email: {
            type: String,
            unique: true
        },
        client_id: {
            type: String
        },
        name: {
            type: String
        },
        client_secret: {
            type: String
        },
        age: {
            type: Number
        },
        role: {
            type: String
        },
        isLive: {
            type: Boolean,
            default: true
        },
    },
    {
        collection: 'users',
        timestamps: true
    }
);


User.plugin(uniqueValidator)
User.plugin(mongoosePaginate)


User.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.client_secret;
    return obj;
}

function compareSecret(client_secret, callback) {
    bcrypt.compare(client_secret, this.client_secret, callback);
};

User.methods.compareSecret = compareSecret
module.exports = mongoose.model('User', User);
