var express = require('express');
const passport = require('passport');
var router = express.Router();

var authController = require('../../controllers/api/authControllerApi');

router.post('/authenticate', authController.authenticate);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/facebookToken', passport.authenticate('facebook-token'), authController.authFacebookToken);


module.exports = router;