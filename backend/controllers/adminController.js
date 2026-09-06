const Storage = require('../services/storage');

// @desc    Get overall platform statistics for Admin
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const users = await Storage.listUsers();
    const farmers = await Storage.listFarmers();
    const products = await Storage.listProducts();
    const orders = await Storage.listAllOrders();

    const customers = users.filter(u => u.role === 'customer');
    
    // Revenue calculations
    let totalRevenue = 0;
    let completedOrders = 0;
    orders.forEach(order => {
      if (order.orderStatus !== 'cancelled') {
        totalRevenue += order.totalAmount;
      }
      if (order.orderStatus === 'delivered') {
        completedOrders += 1;
      }
    });

    // Category distribution
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    // Order status breakdown
    const orderStatusCounts = {
      pending: 0,
      accepted: 0,
      preparing: 0,
      ready: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0
    };
    orders.forEach(o => {
      if (orderStatusCounts[o.orderStatus] !== undefined) {
        orderStatusCounts[o.orderStatus]++;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalFarmers: farmers.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        completedOrders,
        totalRevenue,
        categoryCounts,
        orderStatusCounts
      },
      recentOrders: orders.slice(0, 10),
      recentProducts: products.slice(0, 8),
      recentFarmers: farmers.slice(0, 6)
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getAdminUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await Storage.listUsers(role);
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

// @desc    Verify or reject farmer
// @route   PUT /api/admin/farmers/:id/verify
const setFarmerVerification = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['verified', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const updated = await Storage.updateFarmer(req.params.id, {
      verificationStatus: status
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Farmer status updated to ${status}`,
      farmer: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update farmer verification.' });
  }
};

// @desc    Delete any inappropriate product (Admin)
// @route   DELETE /api/admin/products/:id
const adminDeleteProduct = async (req, res) => {
  try {
    const deleted = await Storage.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.status(200).json({ success: true, message: 'Product successfully removed by Admin.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  setFarmerVerification,
  adminDeleteProduct
};
