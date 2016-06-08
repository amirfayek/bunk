var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


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
  homes: [{ type: Schema.Types.ObjectId, ref: 'Home' }],
  created_at: Date,
  updated_at: Date
});


userSchema.plugin(passportLocalMongoose);


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