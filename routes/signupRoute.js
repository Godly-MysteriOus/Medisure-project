const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController/controller');
router.get('/customer',signupController.getCustomerSignupPage);

module.exports = router;