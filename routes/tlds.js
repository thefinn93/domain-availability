var express = require('express');
var router = express.Router();
var getTLDs = require('../TLDs');

router.get('', function(req, res) {
  getTLDs().then(function(TLDs) {
    res.json(TLDs);
  });
});

module.exports = router;
