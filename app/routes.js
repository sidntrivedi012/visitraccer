module.exports = function(app, passport) {
  const bodyParser = require("body-parser");
  const sendFunc = require("../config/sendmail");
  var Visitor = require("./models/visitor");
  var Host = require("./models/host");
  let hostname, address;
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
    Host.remove({}, function(err, result) {
      if (err) {
        console.err(err);
      } else {
        console.log("Host Logged Out");
      }
    });
    req.logout();
    res.redirect("/");
  });

  // VISITOR DASHBOARD================================

  app.get("/dashboard", function(req, res) {
    console.log("In dashboard");

    Visitor.find({ "local.checkedout": "no" })
      .sort({ _id: -1 })
      .limit(1)
      .exec(function(err, result) {
        console.log(result);

        if (err) throw err;
        res.render("dashboard.ejs", {
          users: result,
          error: false
        });
      });
  });

  // VISITOR CHECKOUT ==============================

  app.get("/checkout", function(req, res) {
    var reqData = JSON.parse(JSON.stringify(req.query));
    console.log(reqData);
    var d = new Date();
    let day = d.getDay();
    let hrs = d.getHours();
    let mins = d.getMinutes();
    let checkouttime = hrs + ":" + mins;
    Host.find({})
      .sort({ _id: -1 })
      .limit(1)
      .exec(function(err, result) {
        if (err) console.error(err);
        console.log(reqData);
        hostname = result[0].local.hostname;
        address = result[0].local.address;
        let text =
          "Name - " +
          reqData.name +
          "\n" +
          "Phone Number - " +
          reqData.phone +
          "\n" +
          "Check-in Time - " +
          reqData.cintime +
          "\n" +
          "Checkout Time - " +
          checkouttime +
          "\n" +
          "Host Name - " +
          hostname +
          "\n" +
          "Address Visited - " +
          address;
        Visitor.update(
          { "local.email": reqData.email },
          {
            $set: {
              "local.checkedout": "yes",
              "local.couttime": checkouttime
            }
          }
        ).exec(function(err, user) {
          if (err) console.log(err);
          else {
            console.log(user);
            sendFunc.sendmail(reqData.email, "visitor", text);
          }
        });
      });

    res.redirect("/home");
  });

  //HOST LOGINS=================================

  // app.get("/hostlogin", function(req, res) {
  //   res.render("hostlogin.ejs", {
  //     message: req.flash("loginMessage")
  //   });
  // });

  // process the login form
  // app.post(
  //   "/hostlogin",
  //   passport.authenticate("hostlogin", {
  //     successRedirect: "/home", // redirect to the secure profile section
  //     failureRedirect: "/hostlogin", // redirect back to the signup page if there is an error
  //     failureFlash: true // allow flash messages
  //   })
  // );

  // HOST SIGNUPS=================================

  app.get("/hostsignup", function(req, res) {
    res.render("hostsignup.ejs", {
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

  app.get("/visitorsignup", function(req, res) {
    res.render("visitorsignup.ejs", {
      message: req.flash("signupMessage")
    });
  });

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
