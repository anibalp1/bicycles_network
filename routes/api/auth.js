var express = require('express');
var router = express.Router();

var authController = require('../../controllers/api/authControllerAPI');

router.post('/autenticate', authController.authenticate);
router.post('/forgotPassword', authController.forgotPassword);

module.exports = router;