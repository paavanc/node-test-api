const express = require('express');
const router = express.Router();
const utils = require('../utils/index');
const middle = require('../middleware/index');
const config = require('../../config');


router.get('/', function (req, res) {
    middle.authCheck([config.roles.admin, config.roles.user], req, res, function () {
        utils.genRest(config.methods.get, config.country.baseUrl + config.country.subUrls.all, null, null, res, function (result) {
            return res.status(200).json(result.RestResponse.result)
        });
    });
});

router.get('/:code', function (req, res) {
    middle.authCheck([config.roles.admin, config.roles.user], req, res, function () {
        utils.genRest(config.methods.get, config.country.baseUrl + config.country.subUrls.iso3code + req.params.code, null, null, res, function (result) {
            return res.status(200).json(result.RestResponse.result)
        });
    });
});
module.exports = router;
