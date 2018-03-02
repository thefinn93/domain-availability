var debug = require('debug')('domain-availability:config');

var configfile = process.env.CONFIG || __dirname + '/config.json'
debug('Loading config from ' + configfile)
module.exports = require(configfile);
debug("Config file: " + module.exports);
