const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const landRoutes = require('./landRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/lands', landRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

// API root
router.get('/', (req, res) => {
  res.json({ message: 'Rent Farming API v1.0' });
});

module.exports = router;
