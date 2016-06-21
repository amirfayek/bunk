var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require('express-flash');


router.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err); }
        res.json({success: true, msg: 'User created successfully. Welcome!'});
    })(req, res, next);
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        res.json({success: true, msg: 'User successfully logged in. Welcome!'});
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;