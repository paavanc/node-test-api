const express = require('express');
const authCheck = require('../middleware/index');
const router = express.Router();


router.post('/', authCheck.login);


module.exports = router;
