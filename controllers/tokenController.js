var User = require('../models/user');
var Token = require('../models/token');

module.exports = {
    confirmation_get: function(req, res, next){
        Token.findOne({ token: req.params.token }, function(err, token){
            if(err) return console.log(err);
            if(!token) return res.status(400).send({ type: 'not-verified', msg: 'Can\'t find a user with that token, please verify your account'});
            
            User.findById({_id: token._userId}, function(err, user){
                if(!user) return res.status(400).send({type: 'not-verified', msg: 'Can\' find find a user with that token'});
                
                if(user.validated) return res.redirect('/users');
                
                user.validated = true;
                user.save(function(err){
                    if(err) return res.status(500).send({msg: err.message});
                    res.redirect('/');
                });
            });
        });
    }
}