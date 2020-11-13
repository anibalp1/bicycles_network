var Bicycle = require('../models/bicycle');

//TODO: Validate valid locations

exports.bicycle_list = function(req, res){
    Bicycle.allBicycles(function(err, bicycles){
        res.render('bicycles/index', {bicycles: bicycles});
    });
}

exports.bicycle_create_get = function(req, res){
    res.render('bicycles/create');
}

exports.bicycle_create_post = function(req, res){
    var bicycle = new Bicycle({ 
        code: req.body.code,
        color: req.body.color,
        model: req.body.model,
        location: [req.body.lat, req.body.lng]
    });
    Bicycle.add(bicycle, function(err, bicycle){
        res.redirect('/bicycles');
    });
}

exports.bicycle_update_get = function(req, res){
    Bicycle.findByCode(req.params.code, function(err, bicycle){   
        res.render('bicycles/update', { bicycle });
    });
}

exports.bicycle_update_post = function(req, res){
    Bicycle.findByCode(req.params.code, function(err, bicycle){
        bicycle.code = req.body.code;
        bicycle.model = req.body.model;
        bicycle.color = req.body.color;
        bicycle.location = [req.body.lat, req.body.lng];
        bicycle.save();

        res.redirect('/bicycles');
    });
}

exports.bicycle_delete_post = function(req, res){
    Bicycle.removeByCode(req.body.code, function(err){
        res.redirect('/bicycles');
    });
}