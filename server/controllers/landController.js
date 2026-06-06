const Land = require('../models/Land');
const SavedListing = require('../models/SavedListing');

/**
 * POST /api/lands – Add a new land listing
 */
const addLand = async (req, res, next) => {
  try {
    const data = {
      ownerId: req.user.id,
      area: req.body.area,
      landUnit: req.body.landUnit,
      crops: req.body.crops,
      soilType: req.body.soilType,
      waterAvailability: req.body.waterAvailability,
      village: req.body.village,
      taluka: req.body.taluka,
      district: req.body.district,
      state: req.body.state,
      expectedRent: req.body.expectedRent,
      rentDuration: req.body.rentDuration,
      description: req.body.description,
      documentPath: null,
    };

    // Handle document upload
    if (req.files && req.files.document && req.files.document[0]) {
      data.documentPath = '/uploads/' + req.files.document[0].filename;
    }

    const land = await Land.create(data);

    // Handle image uploads
    if (req.files && req.files.images) {
      const imagePaths = req.files.images.map((f) => '/uploads/' + f.filename);
      await Land.addImages(land.id, imagePaths);
    }

    res.status(201).json({
      success: true,
      message: 'Land listing submitted. It will be visible after admin approval.',
      land,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/lands/:id – Update a land listing
 */
const updateLand = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    const existing = await Land.findById(landId);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Land listing not found.' });
    }

    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit your own listings.' });
    }

    const data = {
      area: req.body.area || existing.area,
      landUnit: req.body.landUnit || existing.landUnit,
      crops: req.body.crops || existing.crops,
      soilType: req.body.soilType || existing.soilType,
      waterAvailability: req.body.waterAvailability || existing.waterAvailability,
      village: req.body.village || existing.village,
      taluka: req.body.taluka || existing.taluka,
      district: req.body.district || existing.district,
      state: req.body.state || existing.state,
      expectedRent: req.body.expectedRent || existing.expectedRent,
      rentDuration: req.body.rentDuration || existing.rentDuration,
      description: req.body.description || existing.description,
      documentPath: existing.documentPath,
    };

    // Handle new document upload
    if (req.files && req.files.document && req.files.document[0]) {
      data.documentPath = '/uploads/' + req.files.document[0].filename;
    }

    await Land.update(landId, data);

    // Handle new image uploads
    if (req.files && req.files.images) {
      await Land.deleteImages(landId);
      const imagePaths = req.files.images.map((f) => '/uploads/' + f.filename);
      await Land.addImages(landId, imagePaths);
    }

    res.json({ success: true, message: 'Land listing updated. It will be reviewed by admin again.' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/lands/:id – Delete a land listing
 */
const deleteLand = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    const existing = await Land.findById(landId);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Land listing not found.' });
    }

    if (existing.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own listings.' });
    }

    await Land.delete(landId);

    res.json({ success: true, message: 'Land listing deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lands/my – Get logged-in farmer's own land listings
 */
const getMyLands = async (req, res, next) => {
  try {
    const lands = await Land.findByOwner(req.user.id);

    // Attach images to each land
    for (const land of lands) {
      land.images = await Land.getImages(land.id);
    }

    res.json({ success: true, lands });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lands/approved – Public: Get all approved land listings
 */
const getApprovedLands = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const result = await Land.findApproved(page, limit);

    // Attach images
    for (const land of result.lands) {
      land.images = await Land.getImages(land.id);
    }

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lands/search – Public: Search lands with filters
 */
const searchLands = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const filters = {
      state: req.query.state,
      district: req.query.district,
      village: req.query.village,
      soilType: req.query.soilType,
      cropType: req.query.cropType,
      minArea: req.query.minArea ? parseFloat(req.query.minArea) : undefined,
      maxArea: req.query.maxArea ? parseFloat(req.query.maxArea) : undefined,
      minRent: req.query.minRent ? parseFloat(req.query.minRent) : undefined,
      maxRent: req.query.maxRent ? parseFloat(req.query.maxRent) : undefined,
    };

    const result = await Land.search(filters, page, limit);

    // Attach images
    for (const land of result.lands) {
      land.images = await Land.getImages(land.id);
    }

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lands/:id – Get single land listing detail
 */
const getLandById = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    const land = await Land.findById(landId);

    if (!land) {
      return res.status(404).json({ success: false, message: 'Land listing not found.' });
    }

    land.images = await Land.getImages(landId);

    res.json({ success: true, land });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/lands/saved/:id – Save a land listing (Buyer bookmark)
 */
const saveLand = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    const land = await Land.findById(landId);

    if (!land) {
      return res.status(404).json({ success: false, message: 'Land listing not found.' });
    }

    await SavedListing.save(req.user.id, landId);
    res.json({ success: true, message: 'Land listing saved.' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/lands/saved/:id – Unsave a land listing
 */
const unsaveLand = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    await SavedListing.unsave(req.user.id, landId);
    res.json({ success: true, message: 'Land listing removed from saved.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lands/saved – Get all saved land listings for current buyer
 */
const getSavedLands = async (req, res, next) => {
  try {
    const lands = await SavedListing.findByBuyer(req.user.id);

    // Attach images to each land
    for (const land of lands) {
      land.images = await Land.getImages(land.id);
    }

    const count = await SavedListing.countByBuyer(req.user.id);

    res.json({ success: true, lands, total: count });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lands/saved/check/:id – Check if a land is saved by current user
 */
const checkSaved = async (req, res, next) => {
  try {
    const landId = parseInt(req.params.id);
    const isSaved = await SavedListing.isSaved(req.user.id, landId);
    res.json({ success: true, isSaved });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addLand,
  updateLand,
  deleteLand,
  getMyLands,
  getApprovedLands,
  searchLands,
  getLandById,
  saveLand,
  unsaveLand,
  getSavedLands,
  checkSaved,
};

