var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeSchema = new Schema({
    owner: { type : Schema.ObjectId, ref : 'User' },
    address: String,
    city: String,
    state: String,
    zpid: String
});

module.exports = mongoose.model('Home', homeSchema, 'home');