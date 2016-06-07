var express = require('express');
var router = express.Router();

var Zillow = require('node-zillow');
var zillow = new Zillow(process.env.ZILLOW_ID);

/* GET home page. */
router.get('/', function(req, res, next) {
    var parameters = {
      state: req.param('state')
    };

    zillow.get('GetRegionChildren', parameters)
      .then(function(results) {
        console.log(results.response.list)
        res.render('index', results);
        return results
      })
});

module.exports = router;
