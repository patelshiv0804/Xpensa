const db = require("../utils/db");

const getNotificationsByUserId = async (userId) => {
    const [notifications] = await db.query(
        'SELECT nid, ndate, message FROM notifications WHERE user_id = ? ORDER BY ndate DESC',
        [userId]
    );
    return notifications;
};

const createNotification = async (userId, message) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    await db.query(
        'INSERT INTO notifications (user_id, ndate, message) VALUES (?, ?, ?)',
        [userId, currentDate, message]
    );
};

module.exports = { getNotificationsByUserId, createNotification };
