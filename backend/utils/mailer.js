const nodemailer = require('nodemailer');
const config = require('./config');
const logger = require('./logger');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});


const sendResetEmail = async (to, message) => {
    const mailOptions = {
      from: config.emailUser,
      to,
      subject: 'Password Reset Request',
      html: `<p>You have requested to reset your password. ${message}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info('Password reset email sent successfully to', to);
    } catch (error) {
      logger.error('Error sending password reset email to', to, error);
        throw error;
    }
};

module.exports = { sendResetEmail };
