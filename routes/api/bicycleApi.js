var express = require('express');
var router = express.Router();
var bicycleController = require('../../controllers/api/bicycleControllerApi');

router.get('/', bicycleController.bicycle_list);
router.post('/create', bicycleController.bicycle_create);
router.delete('/delete', bicycleController.bicycle_delete);

module.exports = router;