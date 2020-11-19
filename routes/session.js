var express = require('express');
var router = express.Router();
var sessionController = require('../controllers/sessionController');

router.get('/login', sessionController.login_get);
router.post('/login', sessionController.login_post);
router.get('/logout', sessionController.logout_get);
router.post('/forgotPassword', sessionController.forgotpassword_post);
router.get('/forgotPassword', sessionController.forgotpassword_get);
router.get('/resetPassword/:token', sessionController.resetpasssword_get);
router.post('/resetPassword/', sessionController.resetpasssword_post);

module.exports = router;
