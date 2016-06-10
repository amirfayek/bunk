var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')

var watson = require('watson-developer-cloud');
var extend = require('util')._extend;
var i18n = require('i18next');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});

module.exports = router;