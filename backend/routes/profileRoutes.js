
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const profileController = require('../controllers/profileController');
const saveProfileImages = require('../utils/saveProfileImages');

const uploadDir = path.join(__dirname, '..', 'images');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use relative path instead of absolute path
    },
    filename: (req, file, cb) => {
        const uniqueFileName = saveProfileImages(file.originalname);
        req.body.profile_img = uniqueFileName;
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage });

router.post('/add', upload.single('profile_img'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        await profileController.addProfile(req, res, next);
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
});

// Modified to handle cases where no new image is uploaded
router.post('/edit', upload.single('profile_img'), async (req, res, next) => {
    try {
        // Continue even if no file is uploaded
        await profileController.editProfile(req, res, next);
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
});

router.get('/check/:id', profileController.checkProfileExists);

module.exports = router;