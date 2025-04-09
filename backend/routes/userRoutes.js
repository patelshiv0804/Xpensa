
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/reset-request', userController.requestPasswordReset);
router.post('/verify-otp', userController.verifyOtp);
router.post('/reset-password', userController.resetPassword);
router.post('/google-login', userController.googleLogin);

module.exports = router;