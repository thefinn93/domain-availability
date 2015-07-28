var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config.json');
var sentry = new raven.Client(config.dsn);

router.post('/', function(req, res, next) {
  exec('git pull', function(err, stdout, stderr) {
    if(err) {
      console.log(err.stack || err);
      sentry.captureError(err);
      next(err);
    }
    res.json({
      stdout: stdout,
      stderr: stderr
    });
  });
});

module.exports = router;
