const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');

router.post('/edit', preferenceController.editPreferences);
router.get('/get/:user_id', preferenceController.getPreference);

module.exports = router;