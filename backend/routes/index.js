const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const profileRoutes = require('./profileRoutes');
const preferencesRoutes = require('./preferencesRoutes');
const expenseRoutes = require('./expenseRoutes');
const categoryRoutes = require('./categoryRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/user', userRoutes);
router.use('/profile', profileRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/expense', expenseRoutes);
router.use('/category', categoryRoutes);
router.use('/notification', notificationRoutes);

module.exports = router;
