var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash    = require('express-flash');
var session = require('express-session');
var mongoose = require('mongoose')
var db = require('./models/db')
require('./config/passport')(passport);

var routes = require('./routes/index');
var users = require('./routes/users');
var homes = require('./routes/homes');
var sessions = require('./routes/sessions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/', sessions);
app.use('/users', users);
app.use('/homes', homes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;