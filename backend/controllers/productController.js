const Storage = require('../services/storage');

// @desc    Get all products with filters & search
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, organic, minPrice, maxPrice, sort, farmerId } = req.query;

    const products = await Storage.listProducts({
      search,
      category,
      organic,
      minPrice,
      maxPrice,
      sort,
      farmerId
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agricultural products.'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Storage.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const reviews = await Storage.getReviewsByProduct(req.params.id);

    const prodObj = product.toObject ? product.toObject() : product;

    res.status(200).json({
      success: true,
      product: {
        ...prodObj,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving product details.'
    });
  }
};

// @desc    Create new product (Farmer only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    if (!req.farmer) {
      return res.status(403).json({
        success: false,
        message: 'Farmer profile required to add products.'
      });
    }

    const {
      name,
      category,
      description,
      images,
      price,
      unit,
      quantity,
      organic,
      harvestDate,
      farmingMethod,
      location
    } = req.body;

    if (!name || !category || !price || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, category, price, and available quantity.'
      });
    }

    // Default image if none provided
    const productImages = Array.isArray(images) && images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600'];

    const newProduct = await Storage.createProduct({
      farmerId: req.farmer._id,
      name,
      category,
      description: description || 'Fresh farm-harvested produce grown naturally.',
      images: productImages,
      price: Number(price),
      unit: unit || 'kg',
      quantity: Number(quantity),
      organic: organic !== undefined ? Boolean(organic) : true,
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      farmingMethod: farmingMethod || 'Traditional Organic Farming',
      location: location || req.farmer.location || 'Local Farm'
    });

    res.status(201).json({
      success: true,
      message: 'Agricultural product published successfully!',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to publish product.'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Storage.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Authorization check: Must be the farmer who listed it or an admin
    const farmerIdStr = (product.farmerId?._id || product.farmerId)?.toString();
    if (req.user.role !== 'admin' && (!req.farmer || req.farmer._id.toString() !== farmerIdStr)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product.'
      });
    }

    const updated = await Storage.updateProduct(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Storage.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const farmerIdStr = (product.farmerId?._id || product.farmerId)?.toString();
    if (req.user.role !== 'admin' && (!req.farmer || req.farmer._id.toString() !== farmerIdStr)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product.'
      });
    }

    await Storage.deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product removed from marketplace.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};

// @desc    Get products listed by logged-in farmer
// @route   GET /api/products/farmer/me
const getMyFarmerProducts = async (req, res) => {
  try {
    if (!req.farmer) {
      return res.status(403).json({ success: false, message: 'Farmer profile not found.' });
    }

    const products = await Storage.listProducts({ farmerId: req.farmer._id });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch farmer products.' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyFarmerProducts
};
