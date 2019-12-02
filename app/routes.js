module.exports = function(app, passport) {
  const bodyParser = require("body-parser");
  const sendFunc = require("../config/sendmail");
  var Visitor = require("./models/visitor");
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );

  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  app.get("/home", function(req, res) {
    res.render("landing.ejs");
  });

  // LOGOUT ==============================
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // VISITOR DASHBOARD================================

  app.get("/dashboard", function(req, res) {
    Visitor.findOne({ "local.checkedout": "no" }).exec(function(err, users) {
      // console.log( users);

      if (err) throw err;
      res.render("dashboard.ejs", {
        users: users
      });
    });
  });

  // VISITOR CHECKOUT ==============================

  app.get("/checkout", function(req, res) {
    // console.log(req.query);
    var reqData = JSON.parse(JSON.stringify(req.query));
    console.log(reqData);

    Visitor.update(
      { "local.email": reqData.email },
      { $set: { "local.checkedout": "yes", "local.couttime": "12" } }
    ).exec(function(err, user) {
      if (err) console.log(err);
      else {
        console.log(user);
        res.redirect("/home");
      }
    });
    // sendFunc.sendmail(reqData.emailid);
  });

  //HOST LOGINS=================================

  app.get("/hostlogin", function(req, res) {
    res.render("hostlogin.ejs", {
      message: req.flash("loginMessage")
    });
  });

  // process the login form
  app.post(
    "/hostlogin",
    passport.authenticate("hostlogin", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/hostlogin", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // HOST SIGNUPS=================================

  app.get("/hostsignup", function(req, res) {
    res.render("hostsignup.ejs", {
      message: req.flash("signupMessage")
    });
  });

  app.get("/visitorsignup", function(req, res) {
    res.render("visitorsignup.ejs", {
      message: req.flash("signupMessage")
    });
  });
  // process the host signup form
  app.post(
    "/hostsignup",
    passport.authenticate("hostsignup", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/hostsignup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // VISITOR SIGNUP===================================

  app.post(
    "/visitorsignup",
    passport.authenticate("visitorsignup", {
      successRedirect: "/dashboard", // redirect to the secure profile section
      failureRedirect: "/visitorsignup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );
};

// // route middleware to ensure user is logged in
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();

//   res.redirect("/");
// }
