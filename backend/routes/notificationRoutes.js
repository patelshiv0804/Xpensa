const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/alert/:userId", notificationController.getNotifications);
module.exports = router;