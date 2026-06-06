const { sql, getPool } = require('../config/db');

const User = {
  /**
   * Create a new user
   */
  async create({ userId, firstName, lastName, address, surveyNumber, phone, password, role }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('userId', sql.NVarChar(50), userId)
      .input('firstName', sql.NVarChar(100), firstName)
      .input('lastName', sql.NVarChar(100), lastName)
      .input('address', sql.NVarChar(500), address || null)
      .input('surveyNumber', sql.NVarChar(100), surveyNumber || null)
      .input('phone', sql.NVarChar(15), phone)
      .input('password', sql.NVarChar(255), password)
      .input('role', sql.NVarChar(20), role || 'farmer')
      .query(`
        INSERT INTO Users (userId, firstName, lastName, address, surveyNumber, phone, password, role)
        OUTPUT INSERTED.*
        VALUES (@userId, @firstName, @lastName, @address, @surveyNumber, @phone, @password, @role)
      `);
    return result.recordset[0];
  },

  /**
   * Find user by login userId
   */
  async findByUserId(userId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('userId', sql.NVarChar(50), userId)
      .query('SELECT * FROM Users WHERE userId = @userId');
    return result.recordset[0] || null;
  },

  /**
   * Find user by internal id
   */
  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Users WHERE id = @id');
    return result.recordset[0] || null;
  },

  /**
   * Find user by phone number
   */
  async findByPhone(phone) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('phone', sql.NVarChar(15), phone)
      .query('SELECT * FROM Users WHERE phone = @phone');
    return result.recordset[0] || null;
  },

  /**
   * Get all users (for admin), with optional role filter
   */
  async findAll(role = null) {
    const pool = await getPool();
    let query = 'SELECT id, userId, firstName, lastName, address, phone, role, isVerified, isBlocked, createdAt FROM Users';
    const request = pool.request();
    if (role) {
      query += ' WHERE role = @role';
      request.input('role', sql.NVarChar(20), role);
    }
    query += ' ORDER BY createdAt DESC';
    const result = await request.query(query);
    return result.recordset;
  },

  /**
   * Update verification status
   */
  async updateVerification(userId, isVerified) {
    const pool = await getPool();
    await pool
      .request()
      .input('userId', sql.NVarChar(50), userId)
      .input('isVerified', sql.Bit, isVerified)
      .query('UPDATE Users SET isVerified = @isVerified, updatedAt = GETDATE() WHERE userId = @userId');
  },

  /**
   * Block or unblock a user
   */
  async setBlocked(id, isBlocked) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('isBlocked', sql.Bit, isBlocked)
      .query('UPDATE Users SET isBlocked = @isBlocked, updatedAt = GETDATE() WHERE id = @id');
  },

  /**
   * Delete a user
   */
  async delete(id) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE id = @id');
  },

  /**
   * Update password
   */
  async updatePassword(userId, password) {
    const pool = await getPool();
    await pool
      .request()
      .input('userId', sql.NVarChar(50), userId)
      .input('password', sql.NVarChar(255), password)
      .query('UPDATE Users SET password = @password, updatedAt = GETDATE() WHERE userId = @userId');
  },

  /**
   * Update profile
   */
  async updateProfile(id, { firstName, lastName, address, phone }) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('firstName', sql.NVarChar(100), firstName)
      .input('lastName', sql.NVarChar(100), lastName)
      .input('address', sql.NVarChar(500), address)
      .input('phone', sql.NVarChar(15), phone)
      .query(`
        UPDATE Users
        SET firstName = @firstName, lastName = @lastName, address = @address, phone = @phone, updatedAt = GETDATE()
        WHERE id = @id
      `);
  },

  /**
   * Count users by role
   */
  async countByRole(role) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('role', sql.NVarChar(20), role)
      .query('SELECT COUNT(*) as count FROM Users WHERE role = @role');
    return result.recordset[0].count;
  },
};

module.exports = User;
