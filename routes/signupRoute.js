const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController/controller');
const rateLimit = require('../utils/RateLimiter/rateLimiter');
const csrfProtection = require('../middleware/CSRF/csrfProtection');
const check = require('../utils/check/check');
const {upload} = require('../utils/FileUploads/cloudinary');

router.get('/customer',signupController.getCustomerSignupPage);
router.put('/customer',
    [check.emailValidation('customerEmailId')
    ,check.mobileNumberValidation('customerMobileNumber'),
    check.passwordValidation('customerPassword'),
],rateLimit(4,60),csrfProtection,signupController.addCustomer);
router.get('/seller',signupController.getSellerSignupPage);
router.post('/seller',upload.array('storeLogo'),
    [check.nameValidation('sellerName','Invalid Seller Name String'),
     check.emailValidation('sellerEmail'),
     check.passwordValidation('sellerPassword'),
     check.mobileNumberValidation('sellerMobileNumber'),
     check.drugLicenseNumberValidation('drugLicenseNumber'),
     check.gstValidation('gstNumber'),
     check.fssaiNumberValidation('fssaiNumber'),
     check.imageFileValidation('storeLogo'),
     check.pincodeValidation('storePincode')
    ],
   rateLimit(5,10),csrfProtection,signupController.addSeller
)
module.exports = router;