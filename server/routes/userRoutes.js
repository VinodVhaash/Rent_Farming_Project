const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users/farmer-count
router.get('/farmer-count', userController.getFarmerCount);

module.exports = router;
