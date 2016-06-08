var express = require('express'),
 router = express.Router(),
 User = require('../models/user'),
 passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find(function(err, users) {
        if (err) res.send(err);
        res.json(users);
    });
});

/* GET single user listing. */
router.get('/:user_id', function(req, res, next) {
    User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
            res.json(user);
        });
});

router.post('/', function(req, res, next) {
    // create a new user
    var newUser = User({
        first_name: req.query.first_name,
        username: req.query.username,
        password: req.query.password,
        admin: false
    });

    newUser.save(function(err) {
        if (err) throw err;
        console.log('User created!');
        res.json({ message: 'User created!' });
    });
});


module.exports = router;
