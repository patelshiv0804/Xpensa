// const User = require('../models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const logger = require('../utils/logger');
// const crypto = require('crypto');
// const { sendResetEmail } = require('../utils/mailer');
// const config = require('../utils/config');
// // const userService = require('../services/user');



// const registerUser = async (req, res, next) => {
//     try {
//         console.log("Request Body:", req.body);
//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         // Check if user with email already exists
//         const existingUser = await User.getByEmail(email);
//         if (existingUser) {
//             return res.status(400).json({ message: "User with this email already exists" });
//         }

//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Create new user
//         const newUser = await User.create({ email, password: hashedPassword });

//         res.status(201).json({ message: "User registered successfully", userId: newUser.id });
//     } catch (error) {
//         logger.error("Error registering User", error);
//         next(error);
//     }
// };


// const loginUser = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.getByEmail(email);

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         // Generate JWT token
//         const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
//             expiresIn: '1h',
//         });

//         res.json({ token, userId: user.id, userEmail: user.email, message: 'Login successful' });
//     } catch (error) {
//         logger.error('Error logging in User', error);
//         next(error);
//     }
// };

// const requestPasswordReset = async (req, res, next) => {
//     try {
//         const { email } = req.body;
//         const user = await User.getByEmail(email);

//         console.log(user);

//         if (!user) {
//             return res.status(404).json({ message: 'User with this email not found' });
//         }

//         // Generate 4-digit OTP
//         const otp = Math.floor(1000 + Math.random() * 9000).toString();

//         // Convert expiry time to MySQL DATETIME format
//         const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)  // 5 minutes from now
//             .toISOString()
//             .slice(0, 19)
//             .replace("T", " "); // Converts to "YYYY-MM-DD HH:MM:SS"

//         // Store OTP in the database
//         await User.setOtp(user.uid, otp, otpExpiry);

//         // Send OTP email
//         const message = `Your password reset OTP is: ${otp}. It will expire in 5 minutes.`;
//         await sendResetEmail(email, message);

//         res.json({ message: 'Password reset OTP sent' });
//     } catch (error) {
//         logger.error('Error requesting password reset', error);
//         next(error);
//     }
// };

// const resetPassword = async (req, res, next) => {
//     try {
//         const { otp, newPassword } = req.body;

//         const user = await User.getByOtp(otp);

//         if (!user) {
//             return res.status(400).json({ message: 'Invalid OTP' });
//         }

//         const tokenExpiryTime = new Date(user.resetTokenExpiry);

//         if (tokenExpiryTime < new Date()) {
//             return res.status(400).json({ message: 'OTP expired' });
//         }

//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//         await User.updatePassword(user.id, hashedPassword);
//         await User.clearResetToken(user.id);

//         res.json({ message: 'Password reset successfully' });
//     } catch (error) {
//         logger.error('Error resetting password', error);
//         next(error);
//     }
// };

// module.exports = {
//     registerUser,
//     loginUser,
//     requestPasswordReset,
//     resetPassword,
// };


// const User = require('../models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const logger = require('../utils/logger');
// const crypto = require('crypto');
// const { sendResetEmail } = require('../utils/mailer');
// const config = require('../utils/config');



// const registerUser = async (req, res, next) => {
//     try {
//         console.log("Request Body:", req.body);
//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         // Check if user with email already exists
//         const existingUser = await User.getByEmail(email);
//         if (existingUser) {
//             return res.status(400).json({ message: "User with this email already exists" });
//         }

//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Create new user
//         const newUser = await User.create({ email, password: hashedPassword });

//         res.status(201).json({ message: "User registered successfully", userId: newUser.id });
//     } catch (error) {
//         logger.error("Error registering User", error);
//         next(error);
//     }
// };


// const loginUser = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.getByEmail(email);

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         // Generate JWT token
//         const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
//             expiresIn: '1h',
//         });

//         res.json({ token, userId: user.id, userEmail: user.email, message: 'Login successful' });
//     } catch (error) {
//         logger.error('Error logging in User', error);
//         next(error);
//     }
// };

// const requestPasswordReset = async (req, res, next) => {
//     try {
//         const { email } = req.body;
//         const user = await User.getByEmail(email);

//         console.log(user);

//         if (!user) {
//             return res.status(404).json({ message: 'User with this email not found' });
//         }

//         // Generate 4-digit OTP
//         const otp = Math.floor(1000 + Math.random() * 9000).toString();

//         // Convert expiry time to MySQL DATETIME format
//         const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)  // 5 minutes from now
//             .toISOString()
//             .slice(0, 19)
//             .replace("T", " "); // Converts to "YYYY-MM-DD HH:MM:SS"

//         // Store OTP in the database
//         await User.setOtp(user.uid, otp, otpExpiry);

//         // Send OTP email
//         const message = `Your password reset OTP is: ${otp}.It will expire in 5 minutes`;
//         await sendResetEmail(email, message);

//         res.json({ message: 'Password reset OTP sent' });
//     } catch (error) {
//         logger.error('Error requesting password reset', error);
//         next(error);
//     }
// };

// const verifyOtp = async (req, res, next) => {
//     try {

//         const { email, otp } = req.body;

//         const user = await User.getByEmail(email);
//         console.log(user);
//         if (!user || user.reset_token != otp) {
//             return res.status(400).json({ message: 'Invalid OTP' });
//         }

//         const tokenExpiryTime = new Date(user.reset_token_expiry);
//         if (tokenExpiryTime < new Date()) {
//             return res.status(400).json({ message: 'OTP expired' });
//         }

//         res.json({ message: 'OTP verified successfully' });
//     } catch (error) {
//         logger.error('Error verifying OTP', error);
//         next(error);
//     }
// };



// const resetPassword = async (req, res, next) => {
//     try {
//         const { email, newPassword } = req.body;
//         console.log("Email:", email); // Debug log
//         console.log("New Password:", newPassword); // Debug log

//         const user = await User.getByEmail(email);
//         console.log("User:", user); // Debug log

//         if (!user) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//         console.log("Hashed Password:", hashedPassword); // Debug log

//         const updated = await User.updatePassword(user.id, hashedPassword);
//         console.log("Update Result:", updated); // Debug log

//         await User.clearResetToken(user.id);

//         res.json({ message: "Password reset successfully" });
//     } catch (error) {
//         console.error("Error resetting password", error);
//         next(error);
//     }
// };




// module.exports = {
//     registerUser,
//     loginUser,
//     requestPasswordReset,
//     resetPassword,
//     verifyOtp,
// };

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/mailer');
const config = require('../utils/config');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client("320422409970-ldsi80jm4d9jmc33dq0lql91jim97r2o.apps.googleusercontent.com");


const googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Google token is required' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: config.googleClientId,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        // Check if user exists based on email
        let user = await User.getByEmail(email);

        // If the user does not exist, create a new user
        if (!user) {
            user = await User.create({
                email,
                password: null, // No password needed for Google login
            });

            // Ensure user.uid exists before calling addUsername
            if (user && user.id) {
                await User.addUsername(user.id, name);
            } else {
                throw new Error("User ID is missing after creation.");
            }
        }

        // Generate JWT token
        const authToken = jwt.sign({ userId: user.uid, email: user.email }, config.jwtSecret, {
            expiresIn: '1h',
        });

        res.json({
            token: authToken,
            userId: user.uid,
            userEmail: user.email,
            message: 'Google login successful',
        });
    } catch (error) {
        logger.error('Error with Google login', error);
        next(error);
    }
};




const registerUser = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user with email already exists
        const existingUser = await User.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", userId: newUser.uid });
    } catch (error) {
        logger.error("Error registering User", error);
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
            expiresIn: '1h',
        });

        res.json({ token, userId: user.uid, userEmail: user.email, message: 'Login successful' });
    } catch (error) {
        logger.error('Error logging in User', error);
        next(error);
    }
};

const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.getByEmail(email);

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User with this email not found' });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Convert expiry time to MySQL DATETIME format
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)  // 5 minutes from now
            .toISOString()
            .slice(0, 19)
            .replace("T", " "); // Converts to "YYYY-MM-DD HH:MM:SS"

        // Store OTP in the database
        await User.setOtp(user.uid, otp, otpExpiry);

        // Send OTP email
        const message = `Your password reset OTP is: ${otp}.It will expire in 5 minutes.`;
        await sendResetEmail(email, message);

        res.json({ message: 'Password reset OTP sent' });
    } catch (error) {
        logger.error('Error requesting password reset', error);
        next(error);
    }
};

const verifyOtp = async (req, res, next) => {
    try {

        const { email, otp } = req.body;

        const user = await User.getByEmail(email);
        console.log(user);
        if (!user || user.reset_token != otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const tokenExpiryTime = new Date(user.reset_token_expiry);
        if (tokenExpiryTime < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        logger.error('Error verifying OTP', error);
        next(error);
    }
};


const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await User.updatePassword(user.uid, hashedPassword);
        await User.clearResetToken(user.uid);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        logger.error('Error resetting password', error);
        next(error);
    }
};



module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword,
    googleLogin,
    verifyOtp,
};