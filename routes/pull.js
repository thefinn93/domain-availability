var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  exec('git pull', function(err, stdout, stderr) {
    if(err) {
      console.log(err.stack || err);
      next(err);
    }
    res.json({
      stdout: stdout,
      stderr: stderr
    });
  });
});

module.exports = router;
