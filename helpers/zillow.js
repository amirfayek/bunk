var Zillow = require('node-zillow'),
    Q = require('q');

var zillow = new Zillow(process.env.ZILLOW_ID);

function prepareZillowParams(home) {
    // var cityStateZipEncoded = encodeURIComponent(home.city + ", " + home.state + ", " + home.zipcode);
    var spacePattern = /\s/g;

    if (home.address) {
        var addressEncoded = home.address.replace(spacePattern, '+');
    }

    var parameters = {
      address: addressEncoded,
      citystatezip: home.zipcode,
    };

    return parameters
}

function filterZillowResults(results) {
    var deferred = Q.defer();

    console.log(JSON.stringify(results, null, 2))
    var home = {
        zpid: results.response.results.result[0].zpid,
        address: {
            street: results.response.results.result[0].address[0].street[0],
            city: results.response.results.result[0].address[0].city[0],
            state: results.response.results.result[0].address[0].state[0],
            lat: results.response.results.result[0].address[0].latitude[0],
            long: results.response.results.result[0].address[0].longitude[0],
        },
        bedrooms: results.response.results.result[0].bedrooms[0],
        bathrooms: results.response.results.result[0].bathrooms[0],
        yearBuilt: results.response.results.result[0].yearBuilt[0],
        lotSizeSqFt: results.response.results.result[0].lotSizeSqFt[0],
    }
    deferred.resolve(home);
    return deferred.promise;
}

var searchZillowByAddressAndZip = function(home) {
    var deferred = Q.defer();
    var parameters = prepareZillowParams(home);
    var zillowHome = zillow.get('GetDeepSearchResults', parameters)
    deferred.resolve(zillowHome);
    return deferred.promise;
}


module.exports = {
    searchZillowByAddressAndZip: searchZillowByAddressAndZip,
    filterZillowResults: filterZillowResults
}