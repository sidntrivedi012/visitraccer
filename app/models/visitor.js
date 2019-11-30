var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// defining the schema for the model
var userSchema = mongoose.Schema({
  local: {
    visitorname: String,
    email: String,
    visitorphone: Number,
    password: String,
    cintime: String,
    couttime: String,
    location: String
  }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("User", userSchema);
