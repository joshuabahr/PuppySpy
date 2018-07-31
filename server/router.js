const router = require('express').Router();
const userController = require('./controller/userController');

router.post('/user/signup', userController.signupUser);
router.get('/user/profile/:userId', userController.fetchUserProfile);
router.put('/user/profile/:userId', userController.editUserProfile);

module.exports = router;
