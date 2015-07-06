var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config');

router.get('', function(req, res, next) {
  if(config.dsn) {
    exec('git rev-parse HEAD', function(err, stdout, stderr) {
      var ravenconfig = {};
      if(!err) {
        ravenconfig.release = stdout;
      }
      res.send("Raven.config('" + config.dsn + "', " + JSON.stringify(ravenconfig) + ").install();");
    });
  }
});

module.exports = router;
