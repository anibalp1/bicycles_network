var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv').config();
const passport = require('./config/passport');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicyclesRouter = require('./routes/bicycles');
var tokenRouter = require('./routes/token');
var sessionRouter = require('./routes/session');
var authApiRouter = require('./routes/api/authApi');
var bicyclesApiRouter = require('./routes/api/bicycleApi');
var usersApiRouter = require('./routes/api/userApi');

const store = new session.MemoryStore;

var app = express();

app.set('secretKey', 'jwt_bn_lebron_23');

app.use(session({
  cookie: { maxAge: 240 * 60 *60 *1000 },
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_134679_klk'
}))

var mongoose = require('mongoose');
const { request } = require('express');

// var mongoDB = 'mongodb://localhost/bicycle_network';
var mongoDB = process.env.MONGO_URI;
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
app.use('/users', loggedIn, usersRouter);
app.use('/bicycles', loggedIn, bicyclesRouter);
app.use('/token', tokenRouter);
app.use('/session', sessionRouter);
app.use('/api/auth', authApiRouter);
app.use('/api/bicycles', validateUser, bicyclesApiRouter);
app.use('/api/users', validateUser, usersApiRouter);


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

function loggedIn(req, res, next){
  if(req.user){
    next();
  } else{
    console.log('Not logged user');
    res.redirect('session/login');
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
