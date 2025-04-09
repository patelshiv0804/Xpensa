const db = require("../utils/db");

const setPreferences = async (userId, preferences) => {
    await db.query(
        'UPDATE preferences SET budget_overrun_flag = ?, newsletter_flag = ?, daily_notification_flag = ?, weekly_notification_flag = ?, email_flag = ? WHERE user_id = ?',
        [
            preferences.budget_overrun_flag,
            preferences.newsletter_flag,
            preferences.daily_notification_flag,
            preferences.weekly_notification_flag,
            preferences.email_flag,
            userId
        ]
    );
};

const getPreferencesById = async (userId) => {
    const [rows] = await db.query(
        'SELECT * FROM preferences WHERE user_id = ?',
        [userId]
    );
    return rows[0];
};

const addPreferences = async (userId, preferences) => {
    await db.query(
        'INSERT INTO preferences (user_id, budget_overrun_flag, newsletter_flag, daily_notification_flag, weekly_notification_flag, email_flag) VALUES (?, ?, ?, ?, ?, ?)',
        [
            userId,
            preferences.budget_overrun_flag,
            preferences.newsletter_flag,
            preferences.daily_notification_flag,
            preferences.weekly_notification_flag,
            preferences.email_flag
        ]
    );
};

const getBudgetLimit = async (userId) => {
    const preferences = await getPreferencesById(userId);
    return preferences ? preferences.budget_limit : null;
};

module.exports = {
    getPreferencesById,
    setPreferences,
    addPreferences,
    getBudgetLimit
};