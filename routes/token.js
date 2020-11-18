const request = require("request");

var express = require('express');
var router = express.Router();
var tokenController = require('../controllers/tokenController');

router.get('/confirmation/:token', tokenController.confirmation_get);

module.exports = router;