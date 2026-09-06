const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { getDbStatus } = require('../config/db');

// In-Memory / File fallback store for seamless zero-config operation
const DATA_FILE = path.join(__dirname, '../data/local_db.json');

// Ensure data folder exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let memStore = {
  users: [],
  farmers: [],
  products: [],
  orders: [],
  reviews: []
};

// Load saved store if available
try {
  if (fs.existsSync(DATA_FILE)) {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    memStore = JSON.parse(fileContent);
  }
} catch (e) {
  console.warn('Could not read local_db.json, starting fresh memory store.');
}

const saveStore = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving to local_db.json:', err.message);
  }
};

const generateId = () => {
  // Generate a valid 24-character hex string compatible with MongoDB ObjectId
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Math.random().toString(16).substring(2, 18).padStart(16, '0');
  return timestamp + random;
};

// Storage Interface
const Storage = {
  isMongooseActive() {
    return getDbStatus().isConnected;
  },

  // USERS
  async findUserByEmail(email) {
    if (this.isMongooseActive()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (this.isMongooseActive()) {
      return await User.findById(id).select('-passwordHash');
    }
    const user = memStore.users.find(u => u._id.toString() === id.toString());
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async findUserWithPassword(id) {
    if (this.isMongooseActive()) {
      return await User.findById(id);
    }
    return memStore.users.find(u => u._id.toString() === id.toString()) || null;
  },

  async createUser(userData) {
    if (this.isMongooseActive()) {
      const user = new User(userData);
      return await user.save();
    }
    const newUser = {
      _id: generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memStore.users.push(newUser);
    saveStore();
    return newUser;
  },

  async updateUser(id, updateData) {
    if (this.isMongooseActive()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
    }
    const idx = memStore.users.findIndex(u => u._id.toString() === id.toString());
    if (idx === -1) return null;
    memStore.users[idx] = {
      ...memStore.users[idx],
      ...updateData,
      updatedAt: new Date()
    };
    saveStore();
    const { passwordHash, ...safe } = memStore.users[idx];
    return safe;
  },

  async listUsers(filterRole = null) {
    if (this.isMongooseActive()) {
      const query = filterRole ? { role: filterRole } : {};
      return await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
    }
    let list = memStore.users;
    if (filterRole) {
      list = list.filter(u => u.role === filterRole);
    }
    return list.map(({ passwordHash, ...safe }) => safe);
  },

  // FARMERS
  async findFarmerById(id) {
    if (this.isMongooseActive()) {
      return await Farmer.findById(id).populate('userId', 'name email phone profileImage');
    }
    const f = memStore.farmers.find(farm => farm._id.toString() === id.toString());
    if (!f) return null;
    const user = memStore.users.find(u => u._id.toString() === f.userId?.toString());
    return {
      ...f,
      userId: user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, profileImage: user.profileImage } : f.userId
    };
  },

  async findFarmerByUserId(userId) {
    if (this.isMongooseActive()) {
      return await Farmer.findOne({ userId });
    }
    return memStore.farmers.find(f => f.userId.toString() === userId.toString()) || null;
  },

  async createFarmer(farmerData) {
    if (this.isMongooseActive()) {
      const f = new Farmer(farmerData);
      return await f.save();
    }
    const newFarmer = {
      _id: generateId(),
      ...farmerData,
      verificationStatus: farmerData.verificationStatus || 'pending',
      rating: farmerData.rating || 4.8,
      totalProducts: farmerData.totalProducts || 0,
      createdAt: new Date()
    };
    memStore.farmers.push(newFarmer);
    saveStore();
    return newFarmer;
  },

  async updateFarmer(id, updateData) {
    if (this.isMongooseActive()) {
      return await Farmer.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = memStore.farmers.findIndex(f => f._id.toString() === id.toString());
    if (idx === -1) return null;
    memStore.farmers[idx] = { ...memStore.farmers[idx], ...updateData };
    saveStore();
    return memStore.farmers[idx];
  },

  async listFarmers(filterStatus = null) {
    if (this.isMongooseActive()) {
      const query = filterStatus ? { verificationStatus: filterStatus } : {};
      return await Farmer.find(query).populate('userId', 'name email phone profileImage');
    }
    let list = memStore.farmers;
    if (filterStatus) {
      list = list.filter(f => f.verificationStatus === filterStatus);
    }
    return list.map(f => {
      const user = memStore.users.find(u => u._id.toString() === f.userId?.toString());
      return {
        ...f,
        userId: user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone, profileImage: user.profileImage } : f.userId
      };
    });
  },

  // PRODUCTS
  async listProducts({ search, category, organic, minPrice, maxPrice, sort, farmerId } = {}) {
    if (this.isMongooseActive()) {
      let query = {};
      if (farmerId) query.farmerId = farmerId;
      if (category && category !== 'All') query.category = category;
      if (organic !== undefined && organic !== null && organic !== '') {
        query.organic = String(organic) === 'true';
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc') sortOptions = { price: 1 };
      if (sort === 'price_desc') sortOptions = { price: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };
      if (sort === 'newest') sortOptions = { createdAt: -1 };

      return await Product.find(query).populate('farmerId').sort(sortOptions);
    }

    let items = [...memStore.products];

    if (farmerId) {
      items = items.filter(p => p.farmerId?._id?.toString() === farmerId.toString() || p.farmerId?.toString() === farmerId.toString());
    }
    if (category && category !== 'All') {
      items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (organic !== undefined && organic !== null && organic !== '') {
      const isOrg = String(organic) === 'true';
      items = items.filter(p => p.organic === isOrg);
    }
    if (minPrice) {
      items = items.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      items = items.filter(p => p.price <= Number(maxPrice));
    }
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s) ||
        (p.location && p.location.toLowerCase().includes(s))
      );
    }

    // Populate farmerId
    items = items.map(p => {
      const farmer = memStore.farmers.find(f => f._id.toString() === (p.farmerId?._id || p.farmerId)?.toString());
      return {
        ...p,
        farmerId: farmer || p.farmerId
      };
    });

    if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return items;
  },

  async findProductById(id) {
    if (this.isMongooseActive()) {
      return await Product.findById(id).populate('farmerId');
    }
    const p = memStore.products.find(prod => prod._id.toString() === id.toString());
    if (!p) return null;
    const farmer = memStore.farmers.find(f => f._id.toString() === (p.farmerId?._id || p.farmerId)?.toString());
    return {
      ...p,
      farmerId: farmer || p.farmerId
    };
  },

  async createProduct(productData) {
    if (this.isMongooseActive()) {
      const p = new Product(productData);
      const saved = await p.save();
      await Farmer.findByIdAndUpdate(productData.farmerId, { $inc: { totalProducts: 1 } });
      return saved;
    }
    const newProduct = {
      _id: generateId(),
      ...productData,
      rating: productData.rating || 5.0,
      numReviews: 0,
      isAvailable: productData.quantity > 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memStore.products.push(newProduct);
    // update farmer total products
    const fIdx = memStore.farmers.findIndex(f => f._id.toString() === productData.farmerId.toString());
    if (fIdx !== -1) {
      memStore.farmers[fIdx].totalProducts = (memStore.farmers[fIdx].totalProducts || 0) + 1;
    }
    saveStore();
    return newProduct;
  },

  async updateProduct(id, updateData) {
    if (this.isMongooseActive()) {
      if (updateData.quantity !== undefined) {
        updateData.isAvailable = updateData.quantity > 0;
      }
      return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = memStore.products.findIndex(p => p._id.toString() === id.toString());
    if (idx === -1) return null;
    if (updateData.quantity !== undefined) {
      updateData.isAvailable = updateData.quantity > 0;
    }
    memStore.products[idx] = {
      ...memStore.products[idx],
      ...updateData,
      updatedAt: new Date()
    };
    saveStore();
    return memStore.products[idx];
  },

  async deleteProduct(id) {
    if (this.isMongooseActive()) {
      const prod = await Product.findByIdAndDelete(id);
      if (prod) {
        await Farmer.findByIdAndUpdate(prod.farmerId, { $inc: { totalProducts: -1 } });
      }
      return prod;
    }
    const idx = memStore.products.findIndex(p => p._id.toString() === id.toString());
    if (idx === -1) return null;
    const [deleted] = memStore.products.splice(idx, 1);
    const fIdx = memStore.farmers.findIndex(f => f._id.toString() === deleted.farmerId.toString());
    if (fIdx !== -1) {
      memStore.farmers[fIdx].totalProducts = Math.max(0, (memStore.farmers[fIdx].totalProducts || 1) - 1);
    }
    saveStore();
    return deleted;
  },

  async decrementStock(productId, count) {
    if (this.isMongooseActive()) {
      const prod = await Product.findById(productId);
      if (!prod || prod.quantity < count) {
        throw new Error(`Insufficient stock for product ${prod ? prod.name : productId}`);
      }
      prod.quantity -= count;
      prod.isAvailable = prod.quantity > 0;
      await prod.save();
      return prod;
    }
    const prod = memStore.products.find(p => p._id.toString() === productId.toString());
    if (!prod || prod.quantity < count) {
      throw new Error(`Insufficient stock for product ${prod ? prod.name : productId}`);
    }
    prod.quantity -= count;
    prod.isAvailable = prod.quantity > 0;
    saveStore();
    return prod;
  },

  // ORDERS
  async createOrder(orderData) {
    if (this.isMongooseActive()) {
      const order = new Order(orderData);
      return await order.save();
    }
    const newOrder = {
      _id: generateId(),
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memStore.orders.push(newOrder);
    saveStore();
    return newOrder;
  },

  async findOrderById(id) {
    if (this.isMongooseActive()) {
      return await Order.findById(id).populate('customerId', 'name email phone');
    }
    const order = memStore.orders.find(o => o._id.toString() === id.toString() || o.orderNumber === id);
    if (!order) return null;
    const cust = memStore.users.find(u => u._id.toString() === order.customerId?.toString());
    return {
      ...order,
      customerId: cust ? { _id: cust._id, name: cust.name, email: cust.email, phone: cust.phone } : order.customerId
    };
  },

  async listOrdersByCustomer(customerId) {
    if (this.isMongooseActive()) {
      return await Order.find({ customerId }).sort({ createdAt: -1 });
    }
    return memStore.orders
      .filter(o => o.customerId.toString() === customerId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async listOrdersByFarmer(farmerId) {
    if (this.isMongooseActive()) {
      return await Order.find({ 'items.farmerId': farmerId }).populate('customerId', 'name email phone').sort({ createdAt: -1 });
    }
    return memStore.orders
      .filter(o => o.items.some(item => (item.farmerId?._id || item.farmerId).toString() === farmerId.toString()))
      .map(o => {
        const cust = memStore.users.find(u => u._id.toString() === o.customerId?.toString());
        return {
          ...o,
          customerId: cust ? { _id: cust._id, name: cust.name, email: cust.email, phone: cust.phone } : o.customerId
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async listAllOrders() {
    if (this.isMongooseActive()) {
      return await Order.find().populate('customerId', 'name email phone').sort({ createdAt: -1 });
    }
    return memStore.orders
      .map(o => {
        const cust = memStore.users.find(u => u._id.toString() === o.customerId?.toString());
        return {
          ...o,
          customerId: cust ? { _id: cust._id, name: cust.name, email: cust.email, phone: cust.phone } : o.customerId
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async updateOrderStatus(orderId, status, note = '') {
    const titleMap = {
      pending: 'Order Placed',
      accepted: 'Order Accepted by Farmer',
      preparing: 'Harvesting & Packing Fresh Produce',
      ready: 'Ready for Dispatch',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered Freshly to Customer',
      cancelled: 'Order Cancelled'
    };

    const newEvent = {
      status,
      title: titleMap[status] || status,
      note: note || `Status updated to ${status}`,
      timestamp: new Date()
    };

    if (this.isMongooseActive()) {
      return await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: status,
          updatedAt: new Date(),
          $push: { timeline: newEvent }
        },
        { new: true }
      );
    }

    const idx = memStore.orders.findIndex(o => o._id.toString() === orderId.toString());
    if (idx === -1) return null;
    memStore.orders[idx].orderStatus = status;
    memStore.orders[idx].updatedAt = new Date();
    if (!memStore.orders[idx].timeline) memStore.orders[idx].timeline = [];
    memStore.orders[idx].timeline.push(newEvent);
    saveStore();
    return memStore.orders[idx];
  },

  // REVIEWS
  async createReview(reviewData) {
    if (this.isMongooseActive()) {
      const r = new Review(reviewData);
      const saved = await r.save();
      // recalculate product rating
      const reviews = await Review.find({ productId: reviewData.productId });
      const avg = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(reviewData.productId, {
        rating: Math.round(avg * 10) / 10,
        numReviews: reviews.length
      });
      return saved;
    }

    const newReview = {
      _id: generateId(),
      ...reviewData,
      createdAt: new Date()
    };
    memStore.reviews.push(newReview);
    const prodReviews = memStore.reviews.filter(r => r.productId.toString() === reviewData.productId.toString());
    const avg = prodReviews.reduce((sum, item) => sum + item.rating, 0) / prodReviews.length;
    const pIdx = memStore.products.findIndex(p => p._id.toString() === reviewData.productId.toString());
    if (pIdx !== -1) {
      memStore.products[pIdx].rating = Math.round(avg * 10) / 10;
      memStore.products[pIdx].numReviews = prodReviews.length;
    }
    saveStore();
    return newReview;
  },

  async getReviewsByProduct(productId) {
    if (this.isMongooseActive()) {
      return await Review.find({ productId }).sort({ createdAt: -1 });
    }
    return memStore.reviews
      .filter(r => r.productId.toString() === productId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Raw store access for seeder
  getMemStore() {
    return memStore;
  },
  setMemStore(newStore) {
    memStore = newStore;
    saveStore();
  }
};

module.exports = Storage;
