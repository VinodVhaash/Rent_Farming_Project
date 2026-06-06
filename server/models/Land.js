const { sql, getPool } = require('../config/db');

const Land = {
  /**
   * Create a new land listing
   */
  async create(data) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('ownerId', sql.Int, data.ownerId)
      .input('area', sql.Decimal(10, 2), data.area)
      .input('landUnit', sql.NVarChar(20), data.landUnit || 'acre')
      .input('crops', sql.NVarChar(500), data.crops || null)
      .input('soilType', sql.NVarChar(100), data.soilType || null)
      .input('waterAvailability', sql.NVarChar(100), data.waterAvailability || null)
      .input('village', sql.NVarChar(200), data.village || null)
      .input('taluka', sql.NVarChar(200), data.taluka || null)
      .input('district', sql.NVarChar(200), data.district || null)
      .input('state', sql.NVarChar(200), data.state || null)
      .input('expectedRent', sql.Decimal(12, 2), data.expectedRent)
      .input('rentDuration', sql.NVarChar(20), data.rentDuration || 'yearly')
      .input('description', sql.NVarChar(sql.MAX), data.description || null)
      .input('documentPath', sql.NVarChar(500), data.documentPath || null)
      .query(`
        INSERT INTO Lands (ownerId, area, landUnit, crops, soilType, waterAvailability,
          village, taluka, district, state, expectedRent, rentDuration, description, documentPath)
        OUTPUT INSERTED.*
        VALUES (@ownerId, @area, @landUnit, @crops, @soilType, @waterAvailability,
          @village, @taluka, @district, @state, @expectedRent, @rentDuration, @description, @documentPath)
      `);
    return result.recordset[0];
  },

  /**
   * Add images for a land listing
   */
  async addImages(landId, imagePaths) {
    const pool = await getPool();
    for (const imagePath of imagePaths) {
      await pool
        .request()
        .input('landId', sql.Int, landId)
        .input('imagePath', sql.NVarChar(500), imagePath)
        .query('INSERT INTO LandImages (landId, imagePath) VALUES (@landId, @imagePath)');
    }
  },

  /**
   * Get images for a land listing
   */
  async getImages(landId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('landId', sql.Int, landId)
      .query('SELECT * FROM LandImages WHERE landId = @landId');
    return result.recordset;
  },

  /**
   * Update a land listing
   */
  async update(id, data) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('area', sql.Decimal(10, 2), data.area)
      .input('landUnit', sql.NVarChar(20), data.landUnit)
      .input('crops', sql.NVarChar(500), data.crops)
      .input('soilType', sql.NVarChar(100), data.soilType)
      .input('waterAvailability', sql.NVarChar(100), data.waterAvailability)
      .input('village', sql.NVarChar(200), data.village)
      .input('taluka', sql.NVarChar(200), data.taluka)
      .input('district', sql.NVarChar(200), data.district)
      .input('state', sql.NVarChar(200), data.state)
      .input('expectedRent', sql.Decimal(12, 2), data.expectedRent)
      .input('rentDuration', sql.NVarChar(20), data.rentDuration)
      .input('description', sql.NVarChar(sql.MAX), data.description)
      .input('documentPath', sql.NVarChar(500), data.documentPath)
      .query(`
        UPDATE Lands SET
          area = @area, landUnit = @landUnit, crops = @crops, soilType = @soilType,
          waterAvailability = @waterAvailability, village = @village, taluka = @taluka,
          district = @district, state = @state, expectedRent = @expectedRent,
          rentDuration = @rentDuration, description = @description, documentPath = @documentPath,
          approvalStatus = 'pending', rejectionReason = NULL, updatedAt = GETDATE()
        WHERE id = @id
      `);
  },

  /**
   * Delete a land listing
   */
  async delete(id) {
    const pool = await getPool();
    await pool.request().input('id', sql.Int, id).query('DELETE FROM Lands WHERE id = @id');
  },

  /**
   * Find land by id (with owner info)
   */
  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT l.*, u.firstName, u.lastName, u.phone AS ownerPhone, u.userId AS ownerUserId
        FROM Lands l
        JOIN Users u ON l.ownerId = u.id
        WHERE l.id = @id
      `);
    return result.recordset[0] || null;
  },

  /**
   * Find all lands by owner
   */
  async findByOwner(ownerId) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('ownerId', sql.Int, ownerId)
      .query('SELECT * FROM Lands WHERE ownerId = @ownerId ORDER BY createdAt DESC');
    return result.recordset;
  },

  /**
   * Get approved land listings (public browsing) with pagination
   */
  async findApproved(page = 1, limit = 12) {
    const pool = await getPool();
    const offset = (page - 1) * limit;

    const countResult = await pool
      .request()
      .query("SELECT COUNT(*) as total FROM Lands WHERE approvalStatus = 'approved'");
    const total = countResult.recordset[0].total;

    const result = await pool
      .request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT l.*, u.firstName, u.lastName, u.phone AS ownerPhone
        FROM Lands l
        JOIN Users u ON l.ownerId = u.id
        WHERE l.approvalStatus = 'approved'
        ORDER BY l.createdAt DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    return { lands: result.recordset, total, page, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Get pending land listings (admin)
   */
  async findPending() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT l.*, u.firstName, u.lastName, u.phone AS ownerPhone, u.userId AS ownerUserId
      FROM Lands l
      JOIN Users u ON l.ownerId = u.id
      WHERE l.approvalStatus = 'pending'
      ORDER BY l.createdAt ASC
    `);
    return result.recordset;
  },

  /**
   * Update approval status
   */
  async updateStatus(id, status, rejectionReason = null) {
    const pool = await getPool();
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar(20), status)
      .input('rejectionReason', sql.NVarChar(500), rejectionReason)
      .query(`
        UPDATE Lands
        SET approvalStatus = @status, rejectionReason = @rejectionReason, updatedAt = GETDATE()
        WHERE id = @id
      `);
  },

  /**
   * Search lands with filters
   */
  async search(filters, page = 1, limit = 12) {
    const pool = await getPool();
    const offset = (page - 1) * limit;
    const request = pool.request();
    const conditions = ["l.approvalStatus = 'approved'"];

    if (filters.state) {
      conditions.push('l.state = @state');
      request.input('state', sql.NVarChar(200), filters.state);
    }
    if (filters.district) {
      conditions.push('l.district = @district');
      request.input('district', sql.NVarChar(200), filters.district);
    }
    if (filters.village) {
      conditions.push('l.village LIKE @village');
      request.input('village', sql.NVarChar(200), `%${filters.village}%`);
    }
    if (filters.soilType) {
      conditions.push('l.soilType = @soilType');
      request.input('soilType', sql.NVarChar(100), filters.soilType);
    }
    if (filters.cropType) {
      conditions.push('l.crops LIKE @cropType');
      request.input('cropType', sql.NVarChar(500), `%${filters.cropType}%`);
    }
    if (filters.minArea) {
      conditions.push('l.area >= @minArea');
      request.input('minArea', sql.Decimal(10, 2), filters.minArea);
    }
    if (filters.maxArea) {
      conditions.push('l.area <= @maxArea');
      request.input('maxArea', sql.Decimal(10, 2), filters.maxArea);
    }
    if (filters.minRent) {
      conditions.push('l.expectedRent >= @minRent');
      request.input('minRent', sql.Decimal(12, 2), filters.minRent);
    }
    if (filters.maxRent) {
      conditions.push('l.expectedRent <= @maxRent');
      request.input('maxRent', sql.Decimal(12, 2), filters.maxRent);
    }

    const where = conditions.join(' AND ');

    // Count
    const countResult = await pool.request()
      .query(`SELECT COUNT(*) as total FROM Lands l WHERE ${conditions.map((c, i) => {
        // Re-bind for count query – simpler approach: just use the same request
        return c;
      }).join(' AND ')}`
      .replace(/@\w+/g, (match) => {
        // For count we'll do a separate simpler query
        return match;
      }));
    // Actually let's do it properly with a single request
    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, limit);

    const result = await request.query(`
      SELECT l.*, u.firstName, u.lastName, u.phone AS ownerPhone,
        COUNT(*) OVER() AS totalCount
      FROM Lands l
      JOIN Users u ON l.ownerId = u.id
      WHERE ${where}
      ORDER BY l.createdAt DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    const total = result.recordset.length > 0 ? result.recordset[0].totalCount : 0;
    return { lands: result.recordset, total, page, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Count lands by status
   */
  async countByStatus(status) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('status', sql.NVarChar(20), status)
      .query('SELECT COUNT(*) as count FROM Lands WHERE approvalStatus = @status');
    return result.recordset[0].count;
  },

  /**
   * Delete images for a land
   */
  async deleteImages(landId) {
    const pool = await getPool();
    await pool.request().input('landId', sql.Int, landId).query('DELETE FROM LandImages WHERE landId = @landId');
  },
};

module.exports = Land;
