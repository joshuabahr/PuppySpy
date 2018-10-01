const router = require('express').Router();
const userController = require('./controller/userController');
const camController = require('./controller/camController');
const twilioController = require('./controller/twilioController');

// User profile routing
router.post('/user/signup', userController.signupUser);
router.get('/user/profile/:userId', userController.fetchUserProfile);
router.put('/user/profile/:userId', userController.updatePhoneNo);

// Cam routing
router.post('/cam/create', camController.createCam);
router.get('/cam/:userId', camController.fetchActiveUserCams);
// router.get('/cam/all/:userId', camController.fetchAllUserCams);
router.get('/cam/personal/:userId', camController.fetchPersonalCams);
router.put('/cam/name', camController.updateCamName);
router.put('/cam/password', camController.updateCamPassword);
router.post('/cam/adduser', camController.addAllowedCam);
router.put('/cam/close', camController.closeCam);

// Twilio routing
router.post('/sms/alert', twilioController.sendMotionAlert);
router.post('/sms/subscribe', twilioController.sendSubscribeAlert);
// following for twilio webhook
// router.post('/sms/unsubscribe', twilioController.removePhoneNo);

// testing
router.post('/sms/test', twilioController.blockPhoneNo);

module.exports = router;
