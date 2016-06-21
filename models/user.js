var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
    first_name: String,
    last_name: String,
    local            : {
        username     : { type: String, unique: true, max: 15, sparse: true },
        email        : { type: String, unique: true, required: [true, "Email is required"] },
        password     : {type: String, required: true, min: [4, "Password must be at least 4 characters"]}
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
  },
  admin: Boolean,
  address: String,
  meta: {
    bio: String,
    age: Number,
    website: String,
    twitter: String
  },
  homes: [{ type: Schema.Types.ObjectId, ref: 'Home' }],
},
{
    timestamps: true
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


var User = mongoose.model('User', userSchema);
module.exports = User;