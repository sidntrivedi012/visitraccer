var nodemailer = require("nodemailer");
require("dotenv").config();

function sendmail(destid, flag, text) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILADDRESS,
      pass: process.env.PASSWORD
    }
  });

  if (flag == "host") {
    var mailOptions = {
      from: process.env.EMAILADDRESS,
      to: destid,
      subject: "Details about the upcoming visitor.",
      text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  if (flag == "visitor") {
    console.log(text);

    var mailOptions = {
      from: process.env.EMAILADDRESS,
      to: destid,
      subject: "Thanks for the visit.",
      text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

module.exports = { sendmail };
