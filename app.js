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
var sessionRouter = require('./routes/session');
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
app.use('/session', sessionRouter);
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

module.exports = app;
