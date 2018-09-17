const twilio = require('twilio');
const config = require('../../config');
const Table = require('../models/tableModels');

const client = twilio(config.accountSid, config.authToken);
const MessageResponse = twilio.twiml.MessagingResponse;

const subscribeMessage = `This number has been subscribed to receive SMS alerts from PuppySpy. Respond to this message with the word 'STOP' to have this number permanently removed`;

const sendSubscribeAlert = (req, res) => {
  const userNo = `+1${req.body.phone}`;

  console.log('send subscribe alert ', userNo);

  client.messages
    .create({
      body: subscribeMessage,
      from: config.twilioNo,
      to: userNo
    })
    .then(message => {
      console.log(message.sid);
      res.send(message.sid);
    })
    .catch(error => {
      console.log('error sending alert ', error);
      res.send(error);
    })
    .done();
};

const sendMotionAlert = (req, res) => {
  const userNo = `+1${req.body.phone}`;
  const streamName = req.body.cam;

  console.log('send motion alert ', userNo, streamName);

  client.messages
    .create({
      body: `Motion detected on stream: '${streamName}'`,
      from: config.twilioNo,
      to: userNo
    })
    .then(message => {
      console.log(message.sid);
      res.send(message.sid);
    })
    .catch(error => {
      console.log('error sending alert SMS ', error);
      res.send(error);
    })
    .done();
};

// Need to update to basic function when Twilio webhook set up, currently blocks phone number API
const blockPhoneNo = (req, res) => {
  Table.User.find({
    where: {
      phone: req.body.userNo
    }
  })
    .then(user => {
      Table.User.update(
        {
          phone: null
        },
        {
          where: { id: user.id }
        }
      );
    })
    .then(() => {
      Table.Blockphone.create({
        phone: req.body.userNo
      });
    })
    .then(response => {
      console.log('blocked phone no ', response);
      res.send(response);
    })
    .catch(error => {
      console.log('error blocking phone no ', error);
      res.send(error);
    });
};

const removePhoneNo = (req, res) => {
  const messageBody = req.body.Body;
  const userNo = req.body.From;
  const twiml = new MessageResponse();

  if (messageBody.toUpperCase().includes('STOP')) {
    blockPhoneNo(userNo);
    twiml.message('Number permanently deleted');
  } else {
    twiml.message(`If you want your number removed, please include 'STOP' in your response`);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

module.exports = { sendSubscribeAlert, sendMotionAlert, removePhoneNo, blockPhoneNo };
