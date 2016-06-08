var express = require('express'),
 router = express.Router(),
 User = require('../models/user'),
 passport = require('passport');
 LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
/* GET users listing. */
router.post('/login', function(req, res, next) {
      passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
});

module.exports = router;
