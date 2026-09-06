const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyFarmerProducts
} = require('../controllers/productController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/farmer/me', protect, requireRole('farmer'), getMyFarmerProducts);
router.get('/:id', getProductById);
router.post('/', protect, requireRole('farmer'), createProduct);
router.put('/:id', protect, requireRole('farmer', 'admin'), updateProduct);
router.delete('/:id', protect, requireRole('farmer', 'admin'), deleteProduct);

module.exports = router;
