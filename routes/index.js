var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var Zillow = require('node-zillow');
var zillow = new Zillow(process.env.ZILLOW_ID);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* POST home page. */
router.post('/', function(req, res, next) {
    var parameters = prepareZillowParams(req);
    zillow.get('GetDeepSearchResults', parameters)
      .then(function(results) {
        var home = filterHomeResults(results);
        res.send(JSON.stringify({home: home}));
      })
});



function prepareZillowParams(req) {
    var cityStateZipEncoded = encodeURIComponent(req.body.city + req.body.state + req.body.zipcode);
    var spacePattern = /\s/g;
    if (req.body.address) var addressEncoded = req.body.address.replace(spacePattern, '+');
    var parameters = {
      address: addressEncoded,
      citystatezip: cityStateZipEncoded,
    };
    return parameters
}

function filterHomeResults(results) {
    var home = {
        zpid: results.response.results.result[0].zpid,
        address: results.response.results.result[0].address[0].street,
        city: results.response.results.result[0].address[0].city,
        state: results.response.results.result[0].address[0].state,
        beedrooms: results.response.results.result[0].address[0].beedrooms,
        bathrooms: results.response.results.result[0].address[0].bathrooms,
        yearBuilt: results.response.results.result[0].yearBuilt,
        lotSizeSqFt: results.response.results.result[0].lotSizeSqFt,
    }
    return home;
}

module.exports = router;