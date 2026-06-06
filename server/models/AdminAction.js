const { sql, getPool } = require('../config/db');

const AdminAction = {
  /**
   * Log an admin action
   */
  async create({ adminId, actionType, listingId, targetUserId, reason }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('adminId', sql.Int, adminId)
      .input('actionType', sql.NVarChar(50), actionType)
      .input('listingId', sql.Int, listingId || null)
      .input('targetUserId', sql.Int, targetUserId || null)
      .input('reason', sql.NVarChar(500), reason || null)
      .query(`
        INSERT INTO AdminActions (adminId, actionType, listingId, targetUserId, reason)
        OUTPUT INSERTED.*
        VALUES (@adminId, @actionType, @listingId, @targetUserId, @reason)
      `);
    return result.recordset[0];
  },

  /**
   * Get all admin actions (with admin name)
   */
  async findAll(limit = 50) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP (@limit) a.*, u.firstName AS adminFirstName, u.lastName AS adminLastName
        FROM AdminActions a
        JOIN Users u ON a.adminId = u.id
        ORDER BY a.createdAt DESC
      `);
    return result.recordset;
  },
};

module.exports = AdminAction;
