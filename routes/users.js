var watson = require('watson-developer-cloud');

// var personality = require('')

var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Home = require('../models/home'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


router.get('/', function(req, res, next) {
    User.find(function(err, users) {
        if (err) res.send(err);
        res.json(users);
    });
});

router.post('/', function(req, res, next) {
    var newUser = new User(req.query);
    newUser.admin = false;

    newUser.save(function(err, user) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(user);
        }
    });
});

router.get('/:user_id', function(req, res, next) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);
        user.meta.bio = watson.
        res.json(user);
    });
});

router.put('/:user_id', function(req, res, next) {
    console.log(req.body)
    var updateDoc = req.query;
    delete updateDoc._id;

    User.update({_id: req.params.user_id}, {$set: updateDoc}, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to update contact");
      } else {
        res.status(204).end();
      }
    });
});

router.delete('/:user_id', function(req, res, next) {
    User.findByIdAndRemove(req.params.user_id, function(err) {
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
            var newHome = new Home(req.query);
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
