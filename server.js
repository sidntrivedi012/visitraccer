var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
require("dotenv").config();

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var configDB = require("./config/database.js");

mongoose.connect(configDB.url);

require("./config/passport")(passport);
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSIONSECRET, // session secret
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require("./app/routes.js")(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log("The magic happens on port " + port);
