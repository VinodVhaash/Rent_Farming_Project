const User = require('../models/User');

/**
 * GET /api/users/farmer-count
 */
const getFarmerCount = async (req, res, next) => {
  try {
    const count = await User.countByRole('farmer');
    res.json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmerCount
};
