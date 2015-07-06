var express = require('express');
var router = express.Router();
var ncapi = require('../ncapi');

router.get('/:names', function(req, res, next) {
  ncapi('namecheap.domains.check', {'DomainList': req.params.names}).then(function(result) {
    res.json(result);
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
