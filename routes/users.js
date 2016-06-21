var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user'),
    Home = require('../models/home'),
    extend = require('util')._extend,
    watsonPersonalityInsights = require('../helpers/watson-personality-insights'),
    Q = require('q');


router.get('/', function(req, res, next) {
    User.find(function(err, users) {
        if (err) res.send(err);
        res.status(200).json(users);
    });
});

router.post('/', function(req, res, next) {
    var newUser = new User(req.body);
    newUser.admin = false;

    newUser.save(function(err, user) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(user);
        }
    });
});

router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) res.send(err);
    }).lean().then(function(user) {
        if (user.meta.bio) {
            return watsonPersonalityInsights.getProfile(user.meta.bio).then(function(personality) {
                return Object.assign(user, {personality: personality});
            });
        }
        return user;
    }).then(function(user) {
        res.status(200).json(user)
    }).catch(next);
});

router.put('/:id', function(req, res, next) {
    User.findOne({ _id: req.params.id }, function(err, user) {
        if (err) { return res.send(err); }

        for (prop in req.body) {
          user[prop] = req.body[prop];
        }

        // save the user
        user.save(function(err) {
          if (err) {
            return res.send(err);
          }

          res.status(204).json({ message: 'User updated!' });
        });
    });
});

router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            handleError(res, err.message, "Failed to delete contact");
        } else {
            console.log("User successfully deleted")
            res.status(204).end();
        }
    });
});

router.post('/:user_id/homes/', function(req, res, next) {
    User.findById(req.params.user_id, function (err, user) {
        if (err) {
            handleError(res, err.message, "Failed to find user.");
        } else {
            var newHome = new Home(req.body);
            newHome.owners.push(user);
            newHome.save(function(err, home) {
                if (err) {
                    handleError(res, err.message, "Failed to create new home.");
                } else {
                    user.homes.push(home);
                    user.save(function(err) {
                        if (err) {
                          handleError(res, err.message, "Failed to save home to user");
                        } else {
                            res.status(201).json(home);
                        }
                    })
                }
            });
        }
    });
});

router.get('/:user_id/homes/:home_id', function(req, res, next) {
    Home.findById(req.params.home_id, function(err, home) {
        if (err) res.send(err);
        res.json(home);
    });
});




function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}


module.exports = router;
