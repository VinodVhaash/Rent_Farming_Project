const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// ─── Registration ─────────────────────────────────────────────
router.post(
  '/register',
  [
    body('userId').trim().notEmpty().withMessage('User ID is required.'),
    body('firstName').trim().notEmpty().withMessage('First name is required.'),
    body('lastName').trim().notEmpty().withMessage('Last name is required.'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required.')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please enter a valid 10-digit Indian phone number.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must include uppercase, lowercase, number, and special character.'),
    body('role').optional().isIn(['farmer', 'buyer']).withMessage('Role must be farmer or buyer.'),
  ],
  authController.register
);

// ─── OTP Verification ────────────────────────────────────────
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

// ─── Login ───────────────────────────────────────────────────
router.post('/login', authController.login);

// ─── Forgot / Reset Password ────────────────────────────────
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// ─── Profile (authenticated) ────────────────────────────────
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
