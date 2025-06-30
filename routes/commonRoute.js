const express = require('express');
const router = express.Router();
const csrfProtection = require('../middleware/CSRF/csrfProtection');
const commonController = require('../controllers/commonController');
const rateLimit = require('../utils/RateLimiter/rateLimiter');
const checks = require('../utils/check/check');

router.post('/subscribe-to-newsletter',[checks.emailValidation('email')],rateLimit(),csrfProtection,commonController.postSubscriptionToNewsLetter);
router.post('/raise-user-query',
    [checks.emailValidation('emailId'),checks.mobileNumberValidation('mobileNo'),checks.basicMessageValidation('message')],
    rateLimit(),csrfProtection,commonController.postUserQueries
);
router.post('/generate-OTP',[checks.emailValidation('emailId')],rateLimit(5,60),csrfProtection,commonController.postEmailOTPGeneration);
module.exports = router;

router.post('/verify-OTP',rateLimit(5,60),csrfProtection,commonController.emailOTPVerification);
router.post('/pincode-location',checks.pincodeValidation('pincode'),rateLimit(5),csrfProtection,commonController.pincodeVerificationAndLocationDetails);