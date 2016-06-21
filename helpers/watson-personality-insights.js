var watson = require('watson-developer-cloud'),
    i18n = require('i18next'),
    extend = require('util')._extend,
    Q = require('q');


var credentials = {
    version: 'v2',
    username: process.env.IBM_USERNAME,
    password: process.env.IBM_PASSWORD
}

var personalityInsights = watson.personality_insights(credentials);

var getProfile = function(userBio) {
    var deferred = Q.defer();
    var userParams = extend({text: userBio}, { acceptLanguage : i18n.lng() });
    personalityInsights.profile(userParams, function(err, profile) {
      if (err) {
        deferred.reject(new Error(err))
      } else {
        deferred.resolve(profile);
      }
    });
    return deferred.promise;
}


module.exports = {
    getProfile: getProfile
}


