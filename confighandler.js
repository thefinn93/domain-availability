var configfile = process.env.CONFIG || __dirname + '/config.json'

console.log('Loading config from ' + configfile)

module.exports = require(configfile);
