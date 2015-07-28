var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config.json');

router.get('', function(req, res, next) {
  var out = [];
  var dsn = "undefined";
  if(config.dsn) {
    dsn = config.dsn.public
  }
  out.push("Raven.config('" + dsn + "').install();");

  if(config.NCaffiliateID) {
    out.push("var aff = \"&aff=" + config.NCaffiliateID + "\";");
  } else {
    out.push("var aff = \"\";");
  }

  if(config.prioritize) {
    out.push("var prioritize = " + JSON.stringify(config.prioritize) + ";");
  }

  if(config.piwik && config.piwik.uri && config.piwik.site) {
    var trackingCode = "var _paq = _paq || [];\n";
    trackingCode += "_paq.push([\"trackPageView\"]);\n";
    trackingCode += "_paq.push([\"enableLinkTracking\"]);\n";
    trackingCode += "(function() {\n";
    trackingCode += "  var u=\"" + config.piwik.uri + "/\";\n";
    trackingCode += "  _paq.push([\"setTrackerUrl\", u+\"piwik.php\"]);\n";
    trackingCode += "  _paq.push([\"setSiteId\", \"" + config.piwik.site + "\"]);\n";
    trackingCode += "  var d=document, g=d.createElement(\"script\"), s=d.getElementsByTagName(\"script\")[0]; g.type=\"text/javascript\";\n";
    trackingCode += "  g.defer=true; g.async=true; g.src=u+\"piwik.js\"; s.parentNode.insertBefore(g,s);\n";
    trackingCode += "})();\n";
    out.push(trackingCode);
  }
  res.set('Content-Type', 'application/javascript');
  res.send(out.join("\n"));
});

module.exports = router;
