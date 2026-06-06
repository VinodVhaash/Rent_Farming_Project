const { sql, getPool } = require('../config/db');

const SavedListing = {
  /**
   * Save a land listing for a buyer
   */
  async save(buyerId, landId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('buyerId', sql.Int, buyerId)
      .input('landId', sql.Int, landId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM SavedListings WHERE buyerId = @buyerId AND landId = @landId)
        BEGIN
          INSERT INTO SavedListings (buyerId, landId)
          OUTPUT INSERTED.*
          VALUES (@buyerId, @landId)
        END
        ELSE
        BEGIN
          SELECT * FROM SavedListings WHERE buyerId = @buyerId AND landId = @landId
        END
      `);
    return result.recordset[0];
  },

  /**
   * Remove a saved listing
   */
  async unsave(buyerId, landId) {
    const pool = await getPool();
    await pool
      .request()
      .input('buyerId', sql.Int, buyerId)
      .input('landId', sql.Int, landId)
      .query('DELETE FROM SavedListings WHERE buyerId = @buyerId AND landId = @landId');
  },

  /**
   * Get all saved listings for a buyer (with land + owner details)
   */
  async findByBuyer(buyerId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('buyerId', sql.Int, buyerId)
      .query(`
        SELECT s.id AS savedId, s.createdAt AS savedAt,
          l.*, u.firstName, u.lastName, u.phone AS ownerPhone
        FROM SavedListings s
        JOIN Lands l ON s.landId = l.id
        JOIN Users u ON l.ownerId = u.id
        WHERE s.buyerId = @buyerId AND l.approvalStatus = 'approved'
        ORDER BY s.createdAt DESC
      `);
    return result.recordset;
  },

  /**
   * Check if a land is saved by a buyer
   */
  async isSaved(buyerId, landId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('buyerId', sql.Int, buyerId)
      .input('landId', sql.Int, landId)
      .query('SELECT COUNT(*) as count FROM SavedListings WHERE buyerId = @buyerId AND landId = @landId');
    return result.recordset[0].count > 0;
  },

  /**
   * Count total saved listings for a buyer
   */
  async countByBuyer(buyerId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('buyerId', sql.Int, buyerId)
      .query('SELECT COUNT(*) as count FROM SavedListings WHERE buyerId = @buyerId');
    return result.recordset[0].count;
  },
};

module.exports = SavedListing;
