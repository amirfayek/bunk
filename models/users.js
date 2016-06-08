var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  first_name: String,
  last_name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  address: String,
  meta: {
    bio: String,
    age: Number,
    website: String,
    twitter: String
  },
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;