var Bicycle = require('../models/bicycle');

exports.bicycle_list = function(req, res){
    res.render('bicycles/index', {bicycles: Bicycle.allBicycles});
}

exports.bicycle_create_get = function(req, res){
    res.render('bicycles/create');
}

exports.bicycle_create_post = function(req, res){
    var bicycle = new Bicycle(req.body.id, req.body.color, req.body.model);
    bicycle.location = [req.body.lat, req.body.lng];
    Bicycle.add(bicycle);

    res.redirect('/bicycles');
}
exports.bicycle_update_get = function(req, res){
    var bic = Bicycle.findByid(req.params.id); 

    res.render('bicycles/update', {bic});
}

exports.bicycle_update_post = function(req, res){
    var bicycle = Bicycle.findByid(req.params.id);
    bicycle.id = req.body.id;
    bicycle.model = req.body.model;
    bicycle.color = req.body.color;
    bicycle.location = [req.body.lat, req.body.lng];

    res.redirect('/bicycles');
}

exports.bicycle_delete_post = function(req, res){
    Bicycle.removeById(req.body.id);

    res.redirect('/bicycles');
}