var mongoose = require('mongoose');

var homeSchema = new mongoose.Schema({
  address: String,
  city: String,
  state: String,
  zpid: String
});

module.exports = mongoose.model('Home', homeSchema, 'home');