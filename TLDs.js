var express = require('express');
var router = express.Router();
var config = require('./confighandler');
var ncapi = require('./ncapi');
var fs = require('fs');
var Q = require('q');
var debug = require('debug')('domain-availability:TLDs');


function updateTLDs() {
  var deferred = Q.defer();
  var newTLDs = {
    tlds: {}
  };
  debug('Updating TLD list...');
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
          debug(err);
        } else {
          debug('Successfully downloaded TLD list');
        }
        deferred.resolve(newTLDs.tlds);
      });
    } catch(e) {
      debug(e.stack);
    }
  });
  return deferred.promise;
}

module.exports = function() {
  var deferred = Q.defer();
  if(fs.existsSync(config.tlds)) {
    deferred.resolve(require(config.tlds).tlds);
  } else {
    deferred.resolve(updateTLDs());
  }
  return deferred.promise;
};

setInterval(updateTLDs, 24*60*60*1000); // Update the TLD list every 24 hours
updateTLDs(); // Update on first start
