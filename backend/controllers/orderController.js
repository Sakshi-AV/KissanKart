const Storage = require('../services/storage');

// Helper to generate readable Order ID (e.g. KK202600123)
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `KK${year}${random}`;
};

// @desc    Create new order (Customer checkout)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, deliveryFee } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add products before placing an order.'
      });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete delivery address with recipient name, phone, street, and city.'
      });
    }

    // 1. Validate items and inventory availability
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await Storage.findProductById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} was not found in our catalog.`
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sorry, only ${product.quantity} ${product.unit} available for "${product.name}". Please adjust quantity.`
        });
      }

      const farmerId = (product.farmerId?._id || product.farmerId);
      const itemSubtotal = product.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      verifiedItems.push({
        productId: product._id,
        farmerId,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        unit: product.unit || 'kg',
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal
      });
    }

    // 2. Decrement inventory for all ordered products
    for (const item of verifiedItems) {
      await Storage.decrementStock(item.productId, item.quantity);
    }

    const finalDeliveryFee = calculatedSubtotal >= 500 ? 0 : (deliveryFee !== undefined ? deliveryFee : 30);
    const totalAmount = calculatedSubtotal + finalDeliveryFee;

    const orderNumber = generateOrderNumber();

    const newOrder = await Storage.createOrder({
      orderNumber,
      customerId: req.user._id,
      items: verifiedItems,
      totalAmount,
      deliveryFee: finalDeliveryFee,
      deliveryAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'ONLINE' || paymentMethod === 'UPI' ? 'completed' : 'pending',
      orderStatus: 'pending',
      timeline: [
        {
          status: 'pending',
          title: 'Order Placed',
          note: `Order ${orderNumber} received. Awaiting farm confirmation.`,
          timestamp: new Date()
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Your fresh farm order has been placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order.'
    });
  }
};

// @desc    Get orders for logged-in customer
// @route   GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Storage.listOrdersByCustomer(req.user._id);
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

// @desc    Get single order by ID or orderNumber
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Storage.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Authorization: customer who placed it, farmer who sells an item, or admin
    const customerIdStr = (order.customerId?._id || order.customerId)?.toString();
    const isOwner = req.user._id.toString() === customerIdStr;
    const isAdmin = req.user.role === 'admin';
    const isFarmer = req.farmer && order.items.some(item => (item.farmerId?._id || item.farmerId)?.toString() === req.farmer._id.toString());

    if (!isOwner && !isAdmin && !isFarmer) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving order details.' });
  }
};

// @desc    Get orders for logged-in farmer
// @route   GET /api/orders/farmer/me
const getFarmerOrders = async (req, res) => {
  try {
    if (!req.farmer) {
      return res.status(403).json({ success: false, message: 'Farmer profile required.' });
    }

    const orders = await Storage.listOrdersByFarmer(req.farmer._id);
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch incoming orders.' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Storage.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check farmer or admin authority
    const isAdmin = req.user.role === 'admin';
    const isFarmer = req.user.role === 'farmer';

    if (!isAdmin && !isFarmer) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order status.' });
    }

    const updated = await Storage.updateOrderStatus(order._id, status, note);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

// @desc    Cancel order (Customer can cancel pending orders)
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Storage.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const customerIdStr = (order.customerId?._id || order.customerId)?.toString();
    if (req.user._id.toString() !== customerIdStr && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order.' });
    }

    if (['out_for_delivery', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is already out for delivery or delivered.'
      });
    }

    // Replenish stock
    for (const item of order.items) {
      const prod = await Storage.findProductById(item.productId);
      if (prod) {
        await Storage.updateProduct(prod._id, {
          quantity: prod.quantity + item.quantity
        });
      }
    }

    const updated = await Storage.updateOrderStatus(order._id, 'cancelled', 'Order cancelled by customer.');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock replenished.',
      order: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order.' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getFarmerOrders,
  updateOrderStatus,
  cancelOrder
};
