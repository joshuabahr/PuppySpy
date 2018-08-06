const router = require('express').Router();
const userController = require('./controller/userController');
const camController = require('./controller/camController');

// User profile routing
router.post('/user/signup', userController.signupUser);
router.get('/user/profile/:userId', userController.fetchUserProfile);
router.put('/user/profile/:userId', userController.editUserProfile);

// Cam routing
router.post('/cam/create', camController.createCam);
router.get('/cam/:userId', camController.fetchUserCams);
router.post('/cam/adduser', camController.addAllowedCam);
router.put('/cam/close', camController.closeCam);

module.exports = router;
