var debug = require('debug')('domain-availability:config');

var configfile = process.env.CONFIG || __dirname + '/config.json'
console.log('Loading config from ' + configfile)
module.exports = require(configfile);
if(process.env.DEBUG_CONFIG == "true") {
  debug("Config file: " + module.exports);
}
