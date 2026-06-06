const { sql, getPool } = require('../config/db');

const Otp = {
  /**
   * Create a new OTP record
   */
  async create(userId, otp, expiresAt) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('userId', sql.NVarChar(50), userId)
      .input('otp', sql.NVarChar(10), otp)
      .input('expiresAt', sql.DateTime2, expiresAt)
      .query(`
        INSERT INTO OtpVerifications (userId, otp, expiresAt)
        OUTPUT INSERTED.*
        VALUES (@userId, @otp, @expiresAt)
      `);
    return result.recordset[0];
  },

  /**
   * Find latest unverified OTP for a user
   */
  async findLatest(userId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('userId', sql.NVarChar(50), userId)
      .query(`
        SELECT TOP 1 * FROM OtpVerifications
        WHERE userId = @userId AND isVerified = 0
        ORDER BY createdAt DESC
      `);
    return result.recordset[0] || null;
  },

  /**
   * Mark OTP as verified
   */
  async markVerified(id) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('UPDATE OtpVerifications SET isVerified = 1 WHERE id = @id');
  },

  /**
   * Delete expired OTPs (cleanup)
   */
  async deleteExpired() {
    const pool = await getPool();
    await pool.request().query('DELETE FROM OtpVerifications WHERE expiresAt < GETDATE()');
  },
};

module.exports = Otp;
