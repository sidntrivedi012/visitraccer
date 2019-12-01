module.exports = function(app, passport) {
  const bodyParser = require("body-parser");

  var Visitor = require("./models/visitor");
  app.use(bodyParser.urlencoded({ extended: false }));

  // show the home page (will also have our login links)
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  app.get("/dashboard", function(req, res) {
    Visitor.find({ "local.checkedout": "no" }).exec(function(err, users) {
      console.log(users);

      if (err) throw err;
      res.render("dashboard.ejs", { users: users });
    });
  });

  // LOGOUT ==============================
  app.get("/logout", function(req, res) {
    // console.log(req.query);
    var reqData = JSON.parse(JSON.stringify(req.query));
    console.log(reqData);

    Visitor.update(
      { "local.email": reqData.emailid },
      { $set: { "local.checkedout": "yes", "local.couttime": "12" } }
    ).exec(function(err, user) {
      if (err) console.log(err);
      else {
        console.log("db updated");
        // res.sendStatus(201);
        res.redirect("/dashboard");
      }
    });
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/hostlogin", function(req, res) {
    res.render("hostlogin.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/hostlogin",
    passport.authenticate("hostlogin", {
      successRedirect: "/dashboard", // redirect to the secure profile section
      failureRedirect: "/hostlogin", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/hostsignup", function(req, res) {
    res.render("hostsignup.ejs", { message: req.flash("signupMessage") });
  });

  app.get("/visitorsignup", function(req, res) {
    res.render("visitorsignup.ejs", { message: req.flash("signupMessage") });
  });
  // process the host signup form
  app.post(
    "/hostsignup",
    passport.authenticate("hostsignup", {
      successRedirect: "/dashboard", // redirect to the secure profile section
      failureRedirect: "/hostsignup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  //process the visitor signup form
  app.post(
    "/visitorsignup",
    passport.authenticate("visitorsignup", {
      successRedirect: "/dashboard", // redirect to the secure profile section
      failureRedirect: "/visitorsignup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  // locally --------------------------------
  app.get("/connect/local", function(req, res) {
    res.render("connect-local.ejs", { message: req.flash("loginMessage") });
  });
  app.post(
    "/connect/local",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/connect/local", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect("/profile");
    });
  });
};

// // route middleware to ensure user is logged in
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();

//   res.redirect("/");
// }
