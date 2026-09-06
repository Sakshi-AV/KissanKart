const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminUsers,
  setFarmerVerification,
  adminDeleteProduct
} = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect, requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/farmers/:id/verify', setFarmerVerification);
router.delete('/products/:id', adminDeleteProduct);

module.exports = router;
