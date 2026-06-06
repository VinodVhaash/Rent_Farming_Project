const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── Public Routes ───────────────────────────────────────────
router.get('/approved', landController.getApprovedLands);
router.get('/search', landController.searchLands);

// ─── Saved Listings (Buyer) ─────────────────────────────────
router.get('/saved', auth, authorize('buyer'), landController.getSavedLands);
router.get('/saved/check/:id', auth, authorize('buyer'), landController.checkSaved);
router.post('/saved/:id', auth, authorize('buyer'), landController.saveLand);
router.delete('/saved/:id', auth, authorize('buyer'), landController.unsaveLand);

// ─── Single Land Detail (Public) ────────────────────────────
router.get('/:id', landController.getLandById);

// ─── Authenticated (Farmer) Routes ──────────────────────────
router.get('/my/listings', auth, authorize('farmer'), landController.getMyLands);

router.post(
  '/',
  auth,
  authorize('farmer'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'document', maxCount: 1 },
  ]),
  landController.addLand
);

router.put(
  '/:id',
  auth,
  authorize('farmer'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'document', maxCount: 1 },
  ]),
  landController.updateLand
);

router.delete('/:id', auth, landController.deleteLand);

module.exports = router;

