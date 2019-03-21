const express = require('express');
const router = express.Router();
const User = require('mongoose').model('User');
const utils = require('../utils/index');
const middle = require('../middleware/index');
const config = require('../../config');
const userValidate = require('../validators/user');
const randomize = require('randomatic')


router.post('/', function (req, res) {
    middle.authCheck([config.roles.admin], req, res, function () {
        postPutHelper(req, res, userValidate, config.methods.post, function (result) {
            return res.status(200).json(result)
        });
    });
});


router.get('/:id', function (req, res) {
    middle.authCheck([config.roles.admin], req, res, function () {
        utils.findRecord(utils.configureOptions(req), res, User, function (result) {
            return res.status(200).json(result)
        });
    });
});

router.delete('/:id', function (req, res) {
    middle.authCheck([config.roles.admin], req, res, function () {
        utils.deleteRecordById(req, res, User, function (result) {
            return res.status(200).json(result)
        });
    });
});

router.put('/:id', function (req, res) {
    middle.authCheck([config.roles.admin], req, res, function () {
        postPutHelper(req, res, userValidate, config.methods.put, function (result) {
            return res.status(200).json(result)
        });
    });
})

router.patch('/:id', function (req, res) {
    middle.authCheck([config.roles.admin], req, res, function (member) {
        if (!utils.checkNull(req.body.resetCredentials) && req.body.resetCredentials) {
            postPutPatchGenKeysHelper(req, res, config.methods.put, function (result) {
                return res.status(200).json(result)
            });
        } else {
            utils.patchDocumentById(req, res, User, userValidate,function (result) {
                return res.status(200).json(result)
            });
        }
    });

});

router.get('/', function (req, res) {
    middle.authCheck([config.roles.admin], req, res, function (member) {
        utils.getAllDocuments(req, res, User, function (result) {
            return res.status(200).json(result)
        });
    });
});


function postPutPatchGenKeysHelper(req, res, method, next) {
    genKeys(res, function (client_id, secret, hash) {
        req.body.client_id = client_id
        req.body.client_secret = hash
        switch (method) {
            case config.methods.post:
                utils.saveDocument(req, res, User, function (result) {
                    let rtnResult = result.toObject()
                    rtnResult.exposed_client_secret = secret
                    next(rtnResult)
                });
                break;
            case config.methods.put:
                utils.updateDocumentById(req, res, User, function (result) {
                    let rtnResult = result.toObject()
                    rtnResult.exposed_client_secret = secret
                    next(rtnResult)
                });
                break;
            case config.methods.patch:
                utils.patchDocumentById(req, res, User, function (result) {
                    let rtnResult = result.toObject()
                    rtnResult.exposed_client_secret = secret
                    next(rtnResult)
                });
                break;
        }
    });
}

function postPutHelper(req, res, userValidate, method, next) {

    utils.validateDict(req.body, userValidate, function (err) {

        if (err != null && err.length > 0) {
            return res.status(400).json(utils.valiationErrConstructor(err))
        }
        postPutPatchGenKeysHelper(req, res, method, function (result) {
            next(result)
        });
    });
}

function genKeys(res, next) {

    let client_id = 'pk_' + randomize('Aa0', 16, {});
    let secret = 'sk_' + randomize('Aa0', 16, {});
    utils.genHash(secret, function (hash, err) {
        if (err) {
            return res.status(400).json({"message": "failed to salt client_secret"})
        }
        next(client_id, secret, hash)
    });

}

module.exports = router;
