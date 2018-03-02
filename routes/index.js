var express = require('express');
var router = express.Router();
var config = require('../confighandler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Domain Availability Checker', config: config });
});

module.exports = router;
