const express = require('express');
const router = express.Router();
const mongoHealthcheck = require('mongo-healthcheck'),
    mongoose = require('mongoose');
router.get('/version', function (req, res) {
    res.json({
        app: {
            name: 'Node Starter',
            description: 'Node Starter Server',
            version: '1.0.0'
        }
    });
});

router.get('/health', function (req, res) {
    var isError = false;
    var mongoResult;
    try {
        mongoResult = mongoHealthcheck(mongoose);
    } catch (err) {
        isError = true;
        mongoResult = err;
    }
    return res.status(isError ? 500 : 200).json({mongo: mongoResult});
});
module.exports = router;


module.exports = router;