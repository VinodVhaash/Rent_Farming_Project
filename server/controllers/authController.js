const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const otpService = require('../services/otpService');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, firstName, lastName, address, surveyNumber, phone, password, role } = req.body;

    // Check if userId already exists
    const existingUser = await User.findByUserId(userId);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User ID already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      userId,
      firstName,
      lastName,
      address,
      surveyNumber,
      phone,
      password: hashedPassword,
      role: role || 'farmer',
    });

    // Send OTP
    const otpResult = await otpService.sendOtp(userId, phone);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your OTP.',
      userId: user.userId,
      ...(process.env.NODE_ENV !== 'production' && { otp: otpResult.otp }), // dev only
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'userId and otp are required.' });
    }

    const result = await otpService.verifyOtp(userId, otp);

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    // Mark user as verified
    await User.updateVerification(userId, true);

    res.json({ success: true, message: 'Account verified successfully. You can now login.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-otp
 */
const resendOtp = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findByUserId(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account is already verified.' });
    }

    const otpResult = await otpService.sendOtp(userId, user.phone);

    res.json({
      success: true,
      message: 'OTP resent successfully.',
      ...(process.env.NODE_ENV !== 'production' && { otp: otpResult.otp }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ success: false, message: 'userId and password are required.' });
    }

    const user = await User.findByUserId(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked. Contact admin.' });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account not verified. Please verify your OTP first.',
        needsVerification: true,
        userId: user.userId,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { userId, phone } = req.body;

    const user = await User.findByUserId(userId);
    if (!user || user.phone !== phone) {
      return res.status(404).json({ success: false, message: 'No account found with these details.' });
    }

    const otpResult = await otpService.sendOtp(userId, phone);

    res.json({
      success: true,
      message: 'OTP sent to your registered phone number.',
      ...(process.env.NODE_ENV !== 'production' && { otp: otpResult.otp }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'userId, otp, and newPassword are required.' });
    }

    // Verify OTP
    const otpResult = await otpService.verifyOtp(userId, otp);
    if (!otpResult.valid) {
      return res.status(400).json({ success: false, message: otpResult.message });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.updatePassword(userId, hashedPassword);

    res.json({ success: true, message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me – Get current user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        surveyNumber: user.surveyNumber,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile – Update profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, address, phone } = req.body;
    await User.updateProfile(req.user.id, { firstName, lastName, address, phone });
    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
};
