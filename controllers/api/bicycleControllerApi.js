const Bicycle = require('../../models/bicycle');

exports.bicycle_list = function(req, res){
    Bicycle.allBicycles(function(err, bicycles){
        res.status(200).json({
            bicycles: bicycles
        });
    });
}

exports.bicycle_create = function(req, res){
    var bic = new Bicycle({
        code: req.body.code,
        color: req.body.color,
        model: req.body.model, 
        location: [req.body.location[0], req.body.location[1]]
    });

    Bicycle.add(bic, function(err, bicycle){
        if(err){
            res.status(500).send(err);       
        }else{
            res.status(200).json({
                bicycle: bicycle
            });
        }
    });
}

exports.bicycle_update = function(req, res){

    Bicycle.findByCode(req.body.code, function(err, bicycle){
        bicycle.code = req.body.code;
        bicycle.model = req.body.model;
        bicycle.color = req.body.color;
        bicycle.location = [req.body.location[0], req.body.location[1]];
        bicycle.save();
    
        res.status(200).json({
            bicycle: bicycle
        });
    });
}

exports.bicycle_delete = function(req, res){
    var code = req.body.code;
    Bicycle.removeByCode(code, function(err){
        res.status(204).send();
    });
}