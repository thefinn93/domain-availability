var express = require('express');
var router = express.Router();
var config = require('../config.json');
var ncapi = require('../ncapi');
var Q = require('q');
var getTLDs = require('../TLDs');


function addTLDs(name) {
  var deferred = Q.defer();
  getTLDs().then(function(TLDs) {
    var out = [];
    for(var tld in TLDs) {
      if(TLDs.hasOwnProperty(tld)) {
        out.push(name + '.' + tld);
      }
    }
    deferred.resolve(out.join(","));
  }).catch(function(err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

function checkName(name) {
  var deferred = Q.defer();
  addTLDs(name).then(function(names) {
    console.log("Checking", names);
    ncapi('namecheap.domains.check', {'DomainList': names}).then(function(result) {
      deferred.resolve(result);
    }).catch(function(err) {
      console.log(err.stack || err);
      deferred.reject(err);
    });
  }).catch(function(err) {
    console.log(err.stack || err);
    deferred.reject(err);
  });
  return deferred.promise;
}

router.get('/:name', function(req, res, next) {
  checkName(req.params.name).then(function(result) {
    res.json(result);
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
