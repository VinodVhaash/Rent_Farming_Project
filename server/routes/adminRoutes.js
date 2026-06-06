const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(auth, authorize('admin'));

// ─── Dashboard ───────────────────────────────────────────────
router.get('/dashboard', adminController.getDashboardStats);

// ─── Land Approval Management ────────────────────────────────
router.get('/lands/pending', adminController.getPendingLands);
router.put('/lands/:id/approve', adminController.approveLand);
router.put('/lands/:id/reject', adminController.rejectLand);

// ─── User Management ────────────────────────────────────────
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/block', adminController.blockUser);
router.put('/users/:id/unblock', adminController.unblockUser);
router.delete('/users/:id', adminController.deleteUser);

// ─── Reports & Analytics ────────────────────────────────────
router.get('/reports', adminController.getReports);

module.exports = router;
