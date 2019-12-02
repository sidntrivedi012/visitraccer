var nodemailer = require("nodemailer");
require("dotenv").config();

function sendmail(destid) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILADDRESS,
      pass: process.env.PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.EMAILADDRESS,
    to: destid,
    subject: "Sending Email using Node.js",
    text: "That was easy!"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendmail };
