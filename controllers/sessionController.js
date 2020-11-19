var passport = require('../config/passport');
var User = require('../models/user');
var Token = require('../models/token');

module.exports = {
    login_get: function(req,res){
        res.render('session/login');
    },
    login_post: function(req, res, next){
        passport.authenticate('local', function(err, user, info){
            if(err) {
                console.log(err);
                return next(err);
            }
            if(!user) return res.render('session/login', {info});
      
            req.logIn(user, function(err){
                if(err){ 
                    console.log(err);
                    return next(err);
                } 
                return res.redirect('/');
            });
        })(req, res, next);
    },
    create_user_get: function(req, res, next){
        res.render('session/createUser', {errors: {}, user: new User()}); 
    },
    create_user_post: function(req, res, next){
        if(req.body.password != req.body.confirm_password){
            res.render('session/createUser', {errors: {confirm_password: {message: 'The password and the confirm password does not macth'}}, user: new User({name: req.body.name, email: req.body.email})});
            return;
        }

        User.create({name: req.body.name, email: req.body.email, password: req.body.password}, function(err, newUser){
            if(err){
                res.render('users/create', {errors: err.errors, user: new User({name: req.body.name, email: req.body.email })});
            }else {
                newUser.send_welcome_email();
                res.redirect('/users');
            }
        });
    },
    logout_get: function(req, res){
        req.logOut();
        res.redirect('/');
    },
    forgotpassword_get: function(req, res){
        res.render('session/forgotPassword');
    },
    forgotpassword_post: function (req, res) {
        User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) return res.render('session/forgotPassword', { info: { message: 'The given email does not exist' } });
      
            user.resetPassword(function(err) {
                if (err) return next(err);
                console.log('session/forgotPasswordMessage');
            });
      
            res.render('session/forgotPasswordMessage');
        }); 
    },
    resetpasssword_get: function(req, res, next) {
        console.log(req.params.token);
        Token.findOne({ token: req.params.token }, function(err, token) {
            if(!token) return res.status(400).send({ msg: 'Not existing users with the suplied token, please verify that the token is not expired' });
            User.findById(token._userId, function(err, user) {
                if(!user) return res.status(400).send({ msg: 'Not existing users with the suplied token.' });
                res.render('session/resetPassword', {errors: { }, user: user});
            });
        });
    },
    resetpasssword_post: function(req, res) {
        if(req.body.password != req.body.confirm_password) {
            res.render('session/resetPassword', {errors: {confirm_password: {message: 'Passwords does not match!'}}, user: new User({email: req.body.email})});
            return;
        }
        User.findOne({email: req.body.email}, function(err, user) {
            user.password = req.body.password;
            user.save(function(err) {
                if(err) {
                    res.render('session/resetPassword', {errors: err.errors, user: new User({email: req.body.email})});
               } else { 
                    res.render('session/login');
                }
            });
        });
    },
} 