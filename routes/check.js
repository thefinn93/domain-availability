var express = require('express');
var router = express.Router();
var ncapi = require('../ncapi');
var config = require('../config.json');

function getClientIP(req) {
  var clientIP = req.connection.remoteAddress || '127.0.0.1';
  var trustedProxies = ['127.0.0.1'];
  var header = 'X-Forwarded-For';
  if(config.proxies) {
    trustedProxies = config.proxies;
  }
  if(config.realIPheader) {
    header = config.realIPheader;
  }
  if(proxies.indexOf(req.connection.remoteAddress) != -1) {
    clientIP = req.headers[header] || req.connection.remoteAddress;
  }
  return clientIP;
}

router.get('/:names', function(req, res, next) {
  ncapi({Command: 'namecheap.domains.check', DomainList: req.params.names, ClientIP: getClientIP(req)}).then(function(result) {
    res.json(result);
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
