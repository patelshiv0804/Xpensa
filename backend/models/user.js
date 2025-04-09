const db = require("../utils/db");

const create = async (userData) => {
  const { email, password } = userData;

  const [result] = await db.query(
    'INSERT INTO user_auth (email, password) VALUES (?, ?)',
    [email, password]
  );

  const userId = result.insertId;

  await db.query(
    'INSERT INTO preferences (user_id, budget_overrun_flag, newsletter_flag, daily_notification_flag, weekly_notification_flag, email_flag) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, 1, 1, 1, 1, 1]
  );

  return { id: userId, email };
};


const getByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM user_auth WHERE email = ?', [email]);
  return rows[0];
};

const setResetToken = async (userId, resetToken, resetTokenExpiry) => {
  await db.query(
    'UPDATE user_auth SET reset_token = ?, reset_token_expiry = ? WHERE uid = ?',
    [resetToken, resetTokenExpiry, userId]
  );
};

const getByResetToken = async (resetToken) => {
  const [rows] = await db.query('SELECT * FROM user_auth WHERE reset_token = ?', [resetToken]);
  return rows[0];
};

const setOtp = async (userId, otp, otpExpiry) => {
  await db.query(
    'UPDATE user_auth SET reset_token = ?, reset_token_expiry = ? WHERE uid = ?',
    [otp, otpExpiry, userId]
  );
};

const clearResetToken = async (userId) => {
  await db.query(
    'UPDATE user_auth SET reset_token = NULL, reset_token_expiry = NULL WHERE uid = ?',
    [userId]
  );
};

const updatePassword = async (userId, password) => {
  await db.query(
    'UPDATE user_auth set password = ? where uid = ?', [password, userId]
  );
}

const getByOtp = async (otp) => {
  const [rows] = await db.query(
    'SELECT * FROM user_auth WHERE reset_token = ?',
    [otp]
  );
  return rows.length ? rows[0] : null;
};

const addUsername = async (userId, username) => {
  await db.query(
    `INSERT INTO user_profile (user_id, username) 
     VALUES (?, ?) 
     ON DUPLICATE KEY UPDATE username = VALUES(username)`,
    [userId, username]
  );
};

const getByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM user_auth WHERE uid = ?', [userId]);
  return rows[0];
};


module.exports = {
  create,
  getByEmail,
  setResetToken,
  getByResetToken,
  updatePassword,
  clearResetToken,
  setOtp,
  getByOtp,
  addUsername,
  getByUserId
};