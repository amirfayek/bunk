var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
Home = require('../models/home.js');

var Zillow = require('node-zillow');
var zillow = new Zillow(process.env.ZILLOW_ID);

router.get('/', function(req, res, next) {
    Home.find({}, function (err, homes) {
        if (err) {
            return console.error(err);
        } else {
            console.log(homes)
            res.send(JSON.stringify({homes: homes}));
        }
    });
})


router.get('/:home_id', function(req, res, next) {
    Home.findById(req.params.home_id, function(err, home) {
        if (err) res.send(err);

        // var parameters = prepareZillowParams(req);
        // zillow.get('GetDeepSearchResults', parameters)
        //   .then(function(results) {
        //     var home = filterHomeResults(results);

        //     var newHome = Home({
        //             address: home.address,
        //             city: home.city,
        //             state: home.state,
        //             zipcode: home.address
        //     });

        //     newHome.save(function(err) {
        //             if (err) throw err;
        //             console.log('Home created!');
        //             res.json({ message: 'Home created!' });
        //     });

            res.json(home);
          // })
    });
});

router.post('/', function(req, res, next) {
        var updateDoc = req.query;
        delete updateDoc._id;

        var newHome = Home(updateDoc);

        newHome.save(function(err) {
            if (err) throw err;
            console.log('Home created!');
            res.json({ message: 'Home created!' });
        });
      });
    // create a new user


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
