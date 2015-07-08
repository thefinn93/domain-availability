var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');

router.get('/stats.js', function(req, res, next) {
  var out = [];
  if(config.stats) {
    var raw = fs.readFileSync(config.stats, "utf8");
    out.push("var timings = " + JSON.stringify(raw.split("\n")));
  }
  res.set('Content-Type', 'application/javascript');
  res.send(out.join("\n"));
});

router.get('', function(req, res, next) {
  res.render('stats', { title: 'Stats', config: config });
});

module.exports = router;
