require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'xpensa',
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    frontEndUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    geminiApi: process.env.GEMINI_API || 'AIzaSyDpVKOigycfsHmsfkuCFAP8vJ9g7uY-bi8',
    backendurl: process.env.BACKEND_URL || `http://localhost:3000`,
    mode: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_KEY || `9b8d3cfd1c4e8a32a3a9f4b5c6d7e8f9a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
`,
};
