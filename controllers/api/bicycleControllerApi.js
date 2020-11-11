const Bicycle = require('../../models/bicycle');

exports.bicycle_list = function(req, res){
    res.status(200).json({
        bicycles: Bicycle.allBicycles
    });
}

exports.bicycle_create = function(req, res){
    var bic = new Bicycle(req.body.id, req.body.color, req.body.model, [req.body.location[0], req.body.location[1]]);

    Bicycle.add(bic);
    
    res.status(200).json({
        bicycle: bic
    });
}

exports.bicycle_delete = function(req, res){
    Bicycle.removeById(req.body.id);
    res.status(204).send();
}