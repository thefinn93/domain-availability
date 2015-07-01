var express = require('express');
var router = express.Router();
var config = require('../config.json');
var ncapi = require('../ncapi');
var fs = require('fs');
var Q = require('q');


function updateTLDs() {
  var deferred = Q.defer();
  var newTLDs = {
    tlds: {}
  };
  ncapi("namecheap.domains.gettldlist").then(function(response) {
    try {
      response.ApiResponse.CommandResponse[0].Tlds[0].Tld.forEach(function(value) {
        var tld = value.$;
        tld.description = value._;
        newTLDs.tlds[value.$.Name] = tld;
      });
      newTLDs.updated = new Date();
      fs.writeFile(config.tlds, JSON.stringify(newTLDs), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('wrote file');
        }
        deferred.resolve(newTLDs.tlds);
      });
    } catch(e) {
      console.log(e.stack);
    }
  });
  return deferred.promise;
}

var tlds = {};

console.log('Trying to load', config.tlds);
if(fs.existsSync(config.tlds)) {
  tlds = require('../' + config.tlds).tlds;
} else {
  console.log(config.tlds, 'does not exist?');
  updateTLDs().then(function(newTLDs) {
    tlds = newTLDs;
  });
}

function TLDs(name) {
  var out = [];
  for(var tld in tlds) {
    if(tlds.hasOwnProperty(tld)) {
      out.push(name + '.' + tld);
    }
  }
  return out;
}

function checkName() {
  var names = TLDs("finn").join(",");
  console.log("Checking", names);
  return ncapi('namecheap.domains.check', {'DomainList': names}).then(function(result) {
    return result;
  });
}

router.get('/', function(req, res, next) {
  checkName().then(function(result) {
    res.json(result);
  });
});

module.exports = router;
