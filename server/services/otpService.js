const Otp = require('../models/Otp');

const otpService = {
  /**
   * Generate a 6-digit OTP
   */
  generate() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Create and "send" OTP (logs to console in dev mode)
   */
  async sendOtp(userId, phone) {
    const otp = this.generate();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.create(userId, otp, expiresAt);

    // ── DEV MODE: Log OTP to console ──────────────────────────────
    // In production, replace this with a real SMS API call (e.g., MSG91, Twilio)
    console.log(`\n📱 OTP for ${userId} (${phone}): ${otp}\n`);

    // Return OTP in dev mode so the frontend can display it for testing
    if (process.env.NODE_ENV !== 'production') {
      return { otp, expiresAt };
    }

    return { expiresAt };
  },

  /**
   * Verify OTP
   */
  async verifyOtp(userId, otp) {
    const record = await Otp.findLatest(userId);

    if (!record) {
      return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    if (new Date(record.expiresAt) < new Date()) {
      return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (record.otp !== otp) {
      return { valid: false, message: 'Invalid OTP. Please try again.' };
    }

    await Otp.markVerified(record.id);
    return { valid: true, message: 'OTP verified successfully.' };
  },
};

module.exports = otpService;
