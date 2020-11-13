var express = require('express');
var router = express.Router();
var bicycleController = require('../controllers/bicycleController');

router.get('/', bicycleController.bicycle_list);
router.get('/create', bicycleController.bicycle_create_get);
router.post('/create', bicycleController.bicycle_create_post);
router.get('/:code/update', bicycleController.bicycle_update_get);
router.post('/:code/update', bicycleController.bicycle_update_post);
router.post('/:code/delete', bicycleController.bicycle_delete_post);

module.exports = router;