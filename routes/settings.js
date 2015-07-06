var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config');

router.get('', function(req, res, next) {
  var out = [];
  if(config.dsn) {
    exec('git rev-parse HEAD', function(err, stdout, stderr) {
      var ravenconfig = {};
      if(!err) {
        ravenconfig.release = stdout;
      }
      out.push("Raven.config('" + config.dsn + "', " + JSON.stringify(ravenconfig) + ").install();");
    });
  }

  if(config.NCaffiliateID) {
    out.push("var aff = " + config.NCaffiliateID + ";");
  } else {
    out.push("var aff = \"\";");
  }

  if(config.piwik && config.piwik.uri && config.piwik.site) {
    var trackingCode = "var _paq = _paq || [];";
    trackingCode += "_paq.push([\"trackPageView\"]);";
    trackingCode += "_paq.push([\"enableLinkTracking\"]);";
    trackingCode += "(function() {";
    trackingCode += "var u=\"" + config.piwik.uri + "/\";";
    trackingCode += "_paq.push([\"setTrackerUrl\", u+\"piwik.php\"]);";
    trackingCode += "_paq.push([\"setSiteId\", \"" + config.piwik.site + "\"]);";
    trackingCode += "var d=document, g=d.createElement(\"script\"), s=d.getElementsByTagName(\"script\")[0]; g.type=\"text/javascript\";";
    trackingCode += "g.defer=true; g.async=true; g.src=u+\"piwik.js\"; s.parentNode.insertBefore(g,s);";
    trackingCode += "})();";
    out.push(trackingCode);
  }
  res.set('Content-Type', 'application/javascript');
  res.send(out.join("\n"));
});

module.exports = router;
