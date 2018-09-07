const twilio = require('twilio');
const config = require('../../config');

const client = twilio(config.accountSid, config.authToken);

const sendSMSAlert = (req, res) => {
  const userNo = `+1${req.body.phone}`;
  const streamName = req.body.cam;

  console.log('sendSMS ', userNo, streamName);

  client.messages
    .create({
      body: `Motion detected on stream ${streamName}`,
      from: config.twilioNo,
      to: userNo
    })
    .then(message => {
      console.log(message.sid);
      res.send(message.sid);
    })
    .done();
};

module.exports = { sendSMSAlert };
