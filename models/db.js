var mongoose = require('mongoose');
var uri = process.env.PROD_MONGODB || 'mongodb://localhost:27017/roommate-finder';
mongoose.connect(uri);