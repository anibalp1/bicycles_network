const user = require('../../models/user');
const User = require('../../models/user');

exports.user_list = function(req, res){
    User.find({}, function(err, users){
        res.status(200).json({
            users: users
        });
    });
}

exports.user_create = function(req, res){
    var user = new User({ name: req.body.name});

    user.save(function(err){
        res.status(200).json(user);
    });
}

exports.user_reserve = function(req, res){
    User.findById(req.body.id, function(err, user){
        console.log(user);
        user.reserve(req.body.bicycle_id, req.body.startDate, req.body.endDate, function(err){
            console.log('Reservation made!');
            res.status(200).send();
        });
    });
}

exports.bicycle_delete = function(req, res){
    Bicycle.removeById(req.body.id);
    res.status(204).send();
}