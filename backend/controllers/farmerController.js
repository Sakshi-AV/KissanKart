const Storage = require('../services/storage');

// @desc    Get all verified farmers
// @route   GET /api/farmers
const getFarmers = async (req, res) => {
  try {
    const farmers = await Storage.listFarmers();
    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch farmers.' });
  }
};

// @desc    Get farmer profile by ID with products
// @route   GET /api/farmers/:id
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Storage.findFarmerById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }

    const products = await Storage.listProducts({ farmerId: farmer._id });

    res.status(200).json({
      success: true,
      farmer,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving farmer profile.' });
  }
};

// @desc    Update farmer profile
// @route   PUT /api/farmers/:id
const updateFarmerProfile = async (req, res) => {
  try {
    const farmer = await Storage.findFarmerById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && (!req.farmer || req.farmer._id.toString() !== farmer._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile.' });
    }

    const updated = await Storage.updateFarmer(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Farmer profile updated successfully!',
      farmer: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update farmer profile.' });
  }
};

// @desc    Get farmer dashboard statistics & analytics
// @route   GET /api/farmers/me/dashboard
const getFarmerDashboard = async (req, res) => {
  try {
    if (!req.farmer) {
      return res.status(403).json({ success: false, message: 'Farmer profile required.' });
    }

    const farmerId = req.farmer._id;
    const products = await Storage.listProducts({ farmerId });
    const orders = await Storage.listOrdersByFarmer(farmerId);

    // Calculate revenue from delivered and accepted orders
    let totalSales = 0;
    let totalItemsSold = 0;
    const customerSet = new Set();

    orders.forEach(order => {
      if (order.orderStatus !== 'cancelled') {
        order.items.forEach(item => {
          const itemFarmerId = (item.farmerId?._id || item.farmerId)?.toString();
          if (itemFarmerId === farmerId.toString()) {
            totalSales += item.subtotal;
            totalItemsSold += item.quantity;
          }
        });
        if (order.customerId) {
          customerSet.add((order.customerId._id || order.customerId).toString());
        }
      }
    });

    // Stock alerts
    const lowStockThreshold = 10;
    const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= lowStockThreshold);
    const outOfStockProducts = products.filter(p => p.quantity === 0);

    res.status(200).json({
      success: true,
      stats: {
        totalSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customerSet.size,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length
      },
      recentOrders: orders.slice(0, 8),
      lowStockProducts,
      outOfStockProducts,
      products
    });
  } catch (error) {
    console.error('Farmer dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to load farmer analytics.' });
  }
};

module.exports = {
  getFarmers,
  getFarmerById,
  updateFarmerProfile,
  getFarmerDashboard
};
