const User = require('../models/User');
const Land = require('../models/Land');
const AdminAction = require('../models/AdminAction');

/**
 * GET /api/admin/dashboard – Dashboard analytics
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalFarmers, totalBuyers, approvedLands, pendingLands, rejectedLands] = await Promise.all([
      User.countByRole('farmer'),
      User.countByRole('buyer'),
      Land.countByStatus('approved'),
      Land.countByStatus('pending'),
      Land.countByStatus('rejected'),
    ]);

    const recentActions = await AdminAction.findAll(10);

    res.json({
      success: true,
      stats: {
        totalFarmers,
        totalBuyers,
        approvedLands,
        pendingLands,
        rejectedLands,
      },
      recentActions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/lands/pending – Get pending land approvals
 */
const getPendingLands = async (req, res, next) => {
  try {
    const lands = await Land.findPending();

    for (const land of lands) {
      land.images = await Land.getImages(land.id);
    }

    res.json({ success: true, lands });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/lands/:id/approve – Approve a land listing
 */
const approveLand = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    const land = await Land.findById(landId);

    if (!land) {
      return res.status(404).json({ success: false, message: 'Land listing not found.' });
    }

    await Land.updateStatus(landId, 'approved');

    await AdminAction.create({
      adminId: req.user.id,
      actionType: 'approve',
      listingId: landId,
    });

    res.json({ success: true, message: 'Land listing approved successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/lands/:id/reject – Reject a land listing
 */
const rejectLand = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    const { reason } = req.body;

    const land = await Land.findById(landId);
    if (!land) {
      return res.status(404).json({ success: false, message: 'Land listing not found.' });
    }

    await Land.updateStatus(landId, 'rejected', reason);

    await AdminAction.create({
      adminId: req.user.id,
      actionType: 'reject',
      listingId: landId,
      reason,
    });

    res.json({ success: true, message: 'Land listing rejected.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users – Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const role = req.query.role || null;
    const users = await User.findAll(role);
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id/block – Block a user
 */
const blockUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    await User.setBlocked(userId, true);

    await AdminAction.create({
      adminId: req.user.id,
      actionType: 'block',
      targetUserId: userId,
    });

    res.json({ success: true, message: 'User blocked successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id/unblock – Unblock a user
 */
const unblockUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    await User.setBlocked(userId, false);

    await AdminAction.create({
      adminId: req.user.id,
      actionType: 'unblock',
      targetUserId: userId,
    });

    res.json({ success: true, message: 'User unblocked successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:id – Delete a user
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users.' });
    }

    await AdminAction.create({
      adminId: req.user.id,
      actionType: 'delete',
      targetUserId: userId,
      reason: `Deleted user: ${user.userId}`,
    });

    await User.delete(userId);

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/reports – Detailed reports & analytics
 */
const getReports = async (req, res, next) => {
  try {
    const pool = await require('../config/db').getPool();
    const { sql: mssql } = require('../config/db');

    // State-wise land distribution
    const stateResult = await pool.request().query(`
      SELECT state, COUNT(*) as count, approvalStatus
      FROM Lands
      WHERE state IS NOT NULL
      GROUP BY state, approvalStatus
      ORDER BY state
    `);

    // Aggregate state data
    const stateMap = {};
    for (const row of stateResult.recordset) {
      if (!stateMap[row.state]) {
        stateMap[row.state] = { state: row.state, total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      stateMap[row.state][row.approvalStatus] = row.count;
      stateMap[row.state].total += row.count;
    }
    const stateWise = Object.values(stateMap).sort((a, b) => b.total - a.total);

    // Monthly registration trend (last 6 months)
    const trendResult = await pool.request().query(`
      SELECT
        FORMAT(createdAt, 'yyyy-MM') AS month,
        role,
        COUNT(*) AS count
      FROM Users
      WHERE createdAt >= DATEADD(MONTH, -6, GETDATE()) AND role != 'admin'
      GROUP BY FORMAT(createdAt, 'yyyy-MM'), role
      ORDER BY month
    `);

    // Land status summary
    const statusResult = await pool.request().query(`
      SELECT approvalStatus, COUNT(*) as count
      FROM Lands
      GROUP BY approvalStatus
    `);
    const statusSummary = {};
    for (const row of statusResult.recordset) {
      statusSummary[row.approvalStatus] = row.count;
    }

    // Recent admin actions (last 20)
    const recentActions = await AdminAction.findAll(20);

    // Top districts by land count
    const districtResult = await pool.request().query(`
      SELECT TOP 10 district, state, COUNT(*) as count
      FROM Lands
      WHERE district IS NOT NULL AND approvalStatus = 'approved'
      GROUP BY district, state
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      reports: {
        stateWise,
        registrationTrend: trendResult.recordset,
        statusSummary,
        recentActions,
        topDistricts: districtResult.recordset,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getPendingLands,
  approveLand,
  rejectLand,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getReports,
};
