const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController/controller');
const rateLimit = require('../utils/RateLimiter/rateLimiter');
const csrfProtection = require('../middleware/CSRF/csrfProtection');
const check = require('../utils/check/check');
router.get('/customer',signupController.getCustomerSignupPage);
router.put('/customer',
    [check.emailValidation('customerEmailId')
    ,check.mobileNumberValidation('customerMobileNumber'),
    check.passwordValidation('customerPassword'),
],rateLimit(4,60),csrfProtection,signupController.addCustomer);
module.exports = router;