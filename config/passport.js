var LocalStrategy = require("passport-local").Strategy;
const sendFunc = require("./sendmail");
const sendSMS = require("../config/sendSMS");

// loading up the models
var Host = require("../app/models/host");
var Visitor = require("../app/models/visitor");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize the user
  passport.deserializeUser(function(id, done) {
    Host.findById(id, function(err, user) {
      done(err, user);
    });
  });
  // (HOST) LOGIN------------------

  // passport.use(
  //   "hostlogin",
  //   new LocalStrategy(
  //     {
  //       usernameField: "email",
  //       passwordField: "password",
  //       passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  //     },
  //     function(req, email, password, done) {
  //       if (email) email = email.toLowerCase();

  //       // asynchronous part
  //       process.nextTick(function() {
  //         Host.findOne({ "local.email": email }, function(err, user) {
  //           if (err) return done(err);

  //           // if no user is found, return the message
  //           if (!user)
  //             return done(
  //               null,
  //               false,
  //               req.flash("loginMessage", "No user found.")
  //             );

  //           if (!user.validPassword(password))
  //             return done(
  //               null,
  //               false,
  //               req.flash("loginMessage", "Oops! Wrong password.")
  //             );
  //           // all is well, return user
  //           else {
  //             hostemail = email;
  //             console.log(req.user);
  //             hostphone = req.user.hostphone;
  //             return done(null, user);
  //           }
  //         });
  //       });
  //     }
  //   )
  // );

  // HOST SIGNUP-------------------------
  passport.use(
    "hostsignup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      function(req, email, password, done) {
        console.log("host signup user");

        if (email) email = email.toLowerCase();
        process.nextTick(function() {
          console.log(req.user);

          // if the user is not already logged in:
          if (!req.user) {
            Host.findOne({ "local.email": email }, function(err, user) {
              // if there are any errors, return the error
              if (err) return done(err);

              // check to see if theres already a user with that email
              if (user) {
                return done(
                  null,
                  false,
                  req.flash("signupMessage", "That email is already taken.")
                );
              } else {
                // create the user
                var newHost = new Host();
                newHost.local.email = email;
                newHost.local.password = newHost.generateHash(password);
                newHost.local.hostphone = req.body.hostphone;
                newHost.local.hostname = req.body.hostname;
                newHost.local.address = req.body.address;
                newHost.save(function(err) {
                  if (err) return done(err);
                  return done(null, newHost);
                });
              }
            });
            // if the user is logged in but has no local account...
          } else if (!req.user.local.email) {
            // ...presumably they're trying to connect a local account
            // BUT let's check if the email used to connect a local account is being used by another user
            Host.findOne({ "local.email": email }, function(err, user) {
              if (err) return done(err);

              if (user) {
                return done(
                  null,
                  false,
                  req.flash("loginMessage", "That email is already taken.")
                );
                // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
              } else {
                var user = req.user;
                user.local.email = email;
                user.local.password = user.generateHash(password);
                user.save(function(err) {
                  if (err) return done(err);

                  return done(null, user);
                });
              }
            });
          } else {
            // user is logged in and already has a local account. Ignore signup. (We should log out before trying to create a new account)
            return done(null, req.user);
          }
        });
      }
    )
  );

  // VISITOR SIGNUP----------------------------

  passport.use(
    "visitorsignup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      function(req, email, password, done) {
        console.log("visitor user");

        if (email) email = email.toLowerCase();
        // asynchronous
        process.nextTick(function() {
          Visitor.find({ "local.email": email }, function(err, user) {
            // if there are any errors, return the error
            if (err) return done(err);
            else {
              // create the user
              var newVisitor = new Visitor();

              newVisitor.local.visitorname = req.body.visitorname;
              newVisitor.local.email = email;
              newVisitor.local.password = newVisitor.generateHash(password);
              newVisitor.local.visitorphone = req.body.visitorphone;
              newVisitor.local.checkedout = "no";
              var d = new Date();
              let day = d.getDay();
              let hrs = d.getHours();
              let mins = d.getMinutes();
              let timestamp = hrs + ":" + mins;
              newVisitor.local.cintime = timestamp;
              newVisitor.local.couttime = "";
              newVisitor.save(function(err) {
                if (err) return done(err);
                Host.findOne({})
                  .sort({ _id: -1 })
                  .limit(1)
                  .exec(function(err, result) {
                    if (err) console.log(err);
                    console.log(result);
                    let text =
                      "Visitor Name - " +
                      req.body.visitorname +
                      "\n" +
                      "Email address - " +
                      email +
                      "\n" +
                      "Phone number - " +
                      req.body.visitorphone +
                      "\n" +
                      "Check-in Time - " +
                      timestamp +
                      "\n";
                    sendFunc.sendmail(result.local.email, "host", text);
                    sendSMS.store(result.local.hostphone, text);
                  });
                return done(null, newVisitor);
              });
            }
          });

          // if the user is logged in but has no local account...
          // } else if (!req.user.local.email) {
          //   // ...presumably they're trying to connect a local account
          //   // BUT let's check if the email used to connect a local account is being used by another user
          //   User.findOne({ "local.email": email }, function(err, user) {
          //     if (err) return done(err);

          //     if (user) {
          //       return done(
          //         null,
          //         false,
          //         req.flash("loginMessage", "That email is already taken.")
          //       );
          //       // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
          //     } else {
          //       var user = req.user;
          //       user.local.email = email;
          //       user.local.password = user.generateHash(password);
          //       user.save(function(err) {
          //         if (err) return done(err);

          //         return done(null, user);
          //       });
          //     }
          //   });
          // } else {
          //   // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
          //   return done(null, req.user);
          // }
        });
      }
    )
  );
};
