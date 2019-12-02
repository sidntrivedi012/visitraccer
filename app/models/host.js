var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// define the schema for our user model
var hostSchema = mongoose.Schema({
  local: {
    hostname: String,
    email: String,
    hostphone: String,
    password: String,
    address: String
  }
});

// generating a hash
hostSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
hostSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("Host", hostSchema);
