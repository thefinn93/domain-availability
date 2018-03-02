var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var Q = require('q');
var raven = require('raven');
var debug = require('debug')('domain-availability:app');

var ncapi = require('./ncapi');
var routes = require('./routes/index');
var users = require('./routes/users');
var check = require('./routes/check');
var tlds = require('./routes/tlds');
var pull = require('./routes/pull');
var stats = require('./routes/stats');
var settings = require('./routes/settings');

var config = require('./confighandler');

var app = express();

if(config.dsn) {
  debug("Configuring sentry DSN", config.dsn);
  app.use(raven.middleware.express.requestHandler(config.dsn.private));
  app.use(raven.middleware.express.errorHandler(config.dsn.private));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/check', check);
app.use('/tlds', tlds);
app.use('/pull', pull);
app.use('/settings.js', settings);
app.use('/stats', stats);

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
      error: err,
      config: config
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    config: config
  });
});

module.exports = app;
