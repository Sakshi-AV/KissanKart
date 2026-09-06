const express = require('express');
const router = express.Router();
const {
  getFarmers,
  getFarmerById,
  updateFarmerProfile,
  getFarmerDashboard
} = require('../controllers/farmerController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getFarmers);
router.get('/me/dashboard', protect, requireRole('farmer'), getFarmerDashboard);
router.get('/:id', getFarmerById);
router.put('/:id', protect, requireRole('farmer', 'admin'), updateFarmerProfile);

module.exports = router;
