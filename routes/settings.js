var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config');

router.get('', function(req, res, next) {
  var out = [];
  if(config.dsn) {
    exec('git rev-parse HEAD', function(err, stdout, stderr) {
      var ravenconfig = {};
      if(!err) {
        ravenconfig.release = stdout;
      }
      out.push("Raven.config('" + config.dsn + "', " + JSON.stringify(ravenconfig) + ").install();");
    });
  }
  if(config.NCaffiliateID) {
    out.push("var NCaffiliateID = " + config.NCaffiliateID);
  }
  res.send(out.join("\n"));
});

module.exports = router;
