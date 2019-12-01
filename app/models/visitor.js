var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// defining the schema for the model
var visitorSchema = mongoose.Schema({
  local: {
    visitorname: String,
    email: String,
    visitorphone: Number,
    password: String,
    cintime: String,
    couttime: String,
    checkedout: String
  }
});

// generating a hash
visitorSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
visitorSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("Visitor", visitorSchema);
