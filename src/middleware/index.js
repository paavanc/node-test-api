const {base64encode, base64decode} = require('nodejs-base64');
const utils = require('../utils/index');
const User = require('mongoose').model('User');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
const config = require('../../config');


function authHeaderFetcher(req, res, next) {
    if (!req.get('Authorization')) {
        return res.status(401).json({message: 'Auth not provided'});
    }
    let authArr = req.get('Authorization').split(' ');
    let result = authArr[authArr.length - 1];
    next(result)
}

function decodeBasicHeader(req, res, next) {
    authHeaderFetcher(req, res, function (token) {
        let buff = base64decode(token);
        if (utils.checkNull(buff)) {
            return res.status(400).json({'message': 'invalid basic auth'})
        }
        let clientIdSecret = buff.split(':')
        if (clientIdSecret.length < 2) {
            return res.status(400).json({'message': 'invalid basic auth'})
        }
        next({"client_id": clientIdSecret[0], "client_secret": clientIdSecret[1]})
    });
}

function genJWT(member, expires) {
    return jwt.sign(member, config.private_secret, {
        algorithm: 'RS256',
        expiresIn: expires
    });
}

function userOAuth(res, user) {
    return res.status(200).json({
        access_token: genJWT(setUserInfo(user, 'access'), config.tokenDuration),
        type: 'Bearer'
    });
};

function setUserInfo(request, type) {
    return {
        user_id: request._id,
        email: request.email,
        role: request.role,
        grant_type: 'client_id',
        type: type,
        token_id: uuidv1()
    };
}


function login(req, res) {
    decodeBasicHeader(req, res, function (clientPair) {
        if (!req.query.grant_type || req.query.grant_type != 'client_id') {
            return res.status(400).json({'message': 'invalid grant_type'})
        }
        utils.findRecord({
            client_id: clientPair.client_id
        }, res, User, function (result) {

            if (!result.isLive) {
                return res.status(401).json({'message': 'your credentials have been revoked'})
            }
            result.compareSecret(clientPair.client_secret, function (err, isMatch) {

                if (!isMatch || err) {
                    return res.status(401).json({'message': 'invalid credentials'})
                }
                return userOAuth(res, result)

            });

        });
    });
}

module.exports.login = login

function authCheck(roles, req, res, next) {

    authHeaderFetcher(req, res, function (token) {
        let options = {};
        jwt.verify(token, config.public_secret, options, function (err, decoded) {
            if (err || !decoded.type || decoded.type != 'access' || !decoded.user_id || !decoded.grant_type || decoded.grant_type != 'client_id') {
                return res.status(401).json({message: 'Unauthorized user JWT'});
            }
            utils.findRecord({
                _id: decoded.user_id
            }, res, User, function (result) {
                if (err || !result || JSON.stringify(decoded.user_id) != JSON.stringify(result._id) || roles.indexOf(decoded.role) < 0 || !result.isLive) {
                    return res.status(401).json({message: 'Unauthorized user DB'});
                }
                next(result);
            });
        });

    });

};

module.exports.authCheck = authCheck