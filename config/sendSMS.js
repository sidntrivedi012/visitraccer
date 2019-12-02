const Nexmo = require("nexmo");
require("dotenv").config();

const nexmo = new Nexmo({
  apiKey: process.env.NEXMOAPIKEY,
  apiSecret: process.env.NEXMOAPISECRET
});

function store(hostphone, text) {
  hostphone = "91" + hostphone;
  nexmo.message.sendSms(
    process.env.SENDERPHONENUMBER,
    hostphone,
    text,
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
  );
}

module.exports = { store };
