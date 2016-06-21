var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    Q = require('q'),
    zillowHelper = require('../helpers/zillow'),
    Home = require('../models/home.js');


router.get('/', function(req, res, next) {
    Home.find({}, function (err, homes) {
        if (err) { return console.error(err); }
        res.status(201).json(homes);
    });
})

router.get('/:id', function(req, res, next) {
    Home.findById(req.params.id, function(err, home) {
        if (err) { res.send(err) };
    }).lean().then(function(home) {
        if (home.address && home.zipcode) {
                return zillowHelper.searchZillowByAddressAndZip(home)
                    .then(function(zillowDetails){
                        return Object.assign(home, {zillow: zillowDetails
                        });
                }).then(function(home) {
                    return zillowHelper.filterZillowResults(home.zillow);
                })
        }
        return home;
    }).then(function(home) {
            res.status(201).json(home);
    }).catch(next);
});

router.put('/:id', function(req, res, next) {
    Home.findById({ _id: req.params.id }, function(err, home) {
        if (err) { return res.send(err); }

        for (prop in req.body) {
          home[prop] = req.body[prop];
        }

        home.save(function(err) {
          if (err) { return res.send(err); }
          res.status(204).json({ message: 'Home updated!' });
        });
    });
});

router.post('/', function(req, res, next) {
    var updateDoc = req.body;
    var newHome = new Home(updateDoc);
    newHome.save(function(err, home) {
        if (err) throw err;
        console.log('Home created!');
        res.json({
            message: 'Home created!',
            homeId: home._id
        });
    });
});


module.exports = router;
