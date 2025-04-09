const notificationModel = require("../models/notificationModel");
const logger = require("../utils/logger");

const getNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const notifications = await notificationModel.getNotificationsByUserId(userId);

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json({ message: 'Notifications fetched successfully', data: notifications });
    } catch (error) {
        logger.error('Error fetching notifications', error);
        next(error);
    }
};

module.exports = { getNotifications };
