const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/get', agentController.getQueryAnswer);

module.exports = router;

