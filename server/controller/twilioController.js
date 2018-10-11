const twilio = require('twilio');
const Table = require('../models/tableModels');

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const MessageResponse = twilio.twiml.MessagingResponse;

const subscribeMessage = `This number has been subscribed to receive SMS alerts from PuppySpy. Respond to this message with the word 'STOP' to have this number permanently removed`;

const twilioNo = process.env.TWILIO_NO;

const sendSubscribeAlert = (req, res) => {
  const userNo = `+1${req.body.phone}`;

  console.log('send subscribe alert ', userNo);

  client.messages
    .create({
      body: subscribeMessage,
      from: twilioNo,
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
      from: twilioNo,
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

const blockPhoneNo = userNo => {
  console.log('block number ', userNo);
  Table.User.find({
    where: {
      phone: userNo
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
        phone: userNo
      });
    })
    .then(() => {
      console.log('blocked phone no ');
    })
    .catch(error => {
      console.log('error blocking phone no ', error);
    });
};

const removePhoneNo = (req, res) => {
  const messageBody = req.body.Body;
  const userNo = req.body.From;
  const twiml = new MessageResponse();

  console.log('message received ', messageBody, userNo);

  if (messageBody.toUpperCase().includes('STOP')) {
    const phoneNo = userNo.slice(2, 12);
    blockPhoneNo(phoneNo);
    twiml.message('Number permanently deleted');
  } else {
    twiml.message(`If you want your number removed, please include 'STOP' in your response`);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

module.exports = { sendSubscribeAlert, sendMotionAlert, removePhoneNo, blockPhoneNo };
