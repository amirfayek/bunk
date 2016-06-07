var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    Home = require('../models/homes.js');

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(methodOverride(function(req, res){
//       if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//         // look in urlencoded POST bodies and delete it
//         var method = req.body._method
//         delete req.body._method
//         return method
//       }
// }));

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

module.exports = router;
