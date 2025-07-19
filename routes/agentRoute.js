const router = require('express').Router();
const controller = require('../controllers/agentController/testCron');

router.post('/create-test-entry',controller.createTestEntry);

module.exports = router;