var express = require('express');
var router = express.Router();

var authController = require('../../controllers/api/authControllerApi');

router.post('/authenticate', authController.authenticate);
router.post('/forgotPassword', authController.forgotPassword);

module.exports = router;