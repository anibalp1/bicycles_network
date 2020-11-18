var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('./config/passport');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicyclesRouter = require('./routes/bicycles');
var tokenRouter = require('./routes/token');
var bicyclesApiRouter = require('./routes/api/bicycleApi');
var usersApiRouter = require('./routes/api/userApi');

const store = new session.MemoryStore;

var app = express();
app.use(session({
  cookie: { maxAge: 240 * 60 *60 *1000 },
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_134679_klk'
}))

var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost/bicycle_network';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bicycles', bicyclesRouter);
app.use('/token', tokenRouter);

app.use('/api/bicycles', bicyclesApiRouter);
app.use('/api/users', usersApiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/login', function(req,res){
    res.render('sessions/login');
  });
  
  app.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info){
      if(err) return next(err);
      if(!user) return res.render('sessions/login', {info});
  
      req.logIn(user, function(err){
        if(err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  });
  
  app.get('/logout', function(req, res){
   req.logOut();
    res.redirect('/');
  });
  
  app.get('/forgotPassword', function(req, res){
    res.render('sessions/forgotPassword')
  });
  
  app.post('/forgotPassword', function (req, res) {
    Usuario.findOne({ email: req.body.email }, function(err, user) {
        if (!user) return res.render('sessions/forgotPassword', { info: { message: 'The given email does not exist' } });
  
        user.resetPassword(function(err) {
            if (err) return next(err);
            console.log('sessions/forgotPasswordMessage');
        });
  
        res.render('sessions/forgotPasswordMessage');
    }); 
  });
  
  app.get('/resetPassword/:token', function(req, res, next) {
    console.log(req.params.token);
    Token.findOne({ token: req.params.token }, function(err, token) {
        if(!token) return res.status(400).send({ msg: 'Not existing users with the suplied token, please verify that the token is not expired' });
        User.findById(token._userId, function(err, user) {
            if(!user) return res.status(400).send({ msg: 'Not existing users with the suplied token.' });
            res.render('sessions/resetPassword', {errors: { }, user: user});
        });
    });
  });
  
  app.post('/resetPassword', function(req, res) {
    if(req.body.password != req.body.confirm_password) {
        res.render('sessions/resetPassword', {errors: {confirm_password: {message: 'Passwords does not match!'}}, user: new User({email: req.body.email})});
        return;
    }
    Usuario.findOne({email: req.body.email}, function(err, user) {
        user.password = req.body.password;
        user.save(function(err) {
            if(err) {
                res.render('sessions/resetPassword', {errors: err.errors, user: new Usuario({email: req.body.email})});
           } else {
                res.redirect('/login');
            }
        });
    });
  });

function loggedIn(req, res, next){
  if(req.user){
    next();
  } else{
    console.log('Not logged user');
    res.redirect('/login');
  }
}
  
function validateUser(req, res, next){
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded){
    if(err) {
          res.json({status:"error", message:err.message, data:null});
    }else{
        req.body.userId = decoded.id;
        console.log('jwt verify '+decoded);
        next();
      }
});
}

module.exports = app;
