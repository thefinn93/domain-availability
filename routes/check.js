var express = require('express');
var router = express.Router();
var ncapi = require('../ncapi');
var config = require('../confighandler');
var fs = require('fs');
var raven = require('raven');
var sentry = new raven.Client(config.dsn);

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
  if(trustedProxies.indexOf(req.connection.remoteAddress) != -1) {
    clientIP = req.headers[header] || req.connection.remoteAddress;
  }
  return clientIP;
}

function recordTime(start, recordCount) {
  var time = (new Date()) - start;
  if(config.stats) {
    fs.appendFile(config.stats, recordCount + "," + time + "\n", function(err) {
      if(err) {
        console.log(err.stack || err);
        sentry.captureError(err);
      }
    });
  }
}

router.get('/:names', function(req, res, next) {
  var start = new Date();
  var count = req.params.names.split(",").length;
  ncapi({Command: 'namecheap.domains.check', DomainList: req.params.names, ClientIP: getClientIP(req)}).then(function(result) {
    recordTime(start, count);
    try {
      result.ApiResponse.Errors.forEach(function(error) {
        if(error !== "") {
          console.log(error.Error[0]);
          sentry.captureMessage(JSON.stringify(error.Error[0]._, {extra: error.Error[0].$}));
        }
      });
    } catch(e) {
      console.log(e.stack || e);
      sentry.captureError(e);
    }
    res.json(result);
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
