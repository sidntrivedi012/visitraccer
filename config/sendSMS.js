const Nexmo = require("nexmo");
require("dotenv").config();

const nexmo = new Nexmo({
  apiKey: process.env.NEXMOAPIKEY,
  apiSecret: process.env.NEXMOAPISECRET
});

function store(hostphone) {
  hostphone = "91" + hostphone;
  nexmo.message.sendSms(
    "919956622300",
    hostphone,
    "yo",
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
