const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/get/:userId', categoryController.getCategoryDetails);
router.post('/add/:userId/:category', categoryController.addCategory);
router.delete('/delete/:cid', categoryController.removeCategory);
router.put('/edit', categoryController.updateCategory);

module.exports = router;