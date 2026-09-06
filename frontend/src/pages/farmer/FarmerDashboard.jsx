import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Sparkles,
  MapPin,
  Leaf
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { CATEGORIES } from '../../components/product/CategoryPills';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for Add / Edit Product
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Form fields
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    quantity: '',
    description: '',
    organic: true,
    harvestDate: new Date().toISOString().split('T')[0],
    farmingMethod: 'Natural Organic Farming',
    location: '',
    images: ['']
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes, ordRes] = await Promise.all([
        api.get('/farmers/me/dashboard'),
        api.get('/products/farmer/me'),
        api.get('/orders/farmer/me')
      ]);

      if (dashRes.success) setStats(dashRes.stats);
      if (prodRes.success) setProducts(prodRes.products);
      if (ordRes.success) setOrders(ordRes.orders);
    } catch (err) {
      console.error('Error fetching farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      quantity: '',
      description: '',
      organic: true,
      harvestDate: new Date().toISOString().split('T')[0],
      farmingMethod: 'Natural Organic Farming',
      location: user?.farmer?.location || 'Local Farm',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800']
    });
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProductId(p._id);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      unit: p.unit || 'kg',
      quantity: p.quantity,
      description: p.description,
      organic: p.organic,
      harvestDate: p.harvestDate ? new Date(p.harvestDate).toISOString().split('T')[0] : '',
      farmingMethod: p.farmingMethod || '',
      location: p.location || '',
      images: p.images || ['']
    });
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || productForm.quantity === '') {
      showToast('Please fill out product name, price, and stock quantity.', 'warning');
      return;
    }

    setSavingProduct(true);
    try {
      if (editingProductId) {
        // Update
        const data = await api.put(`/products/${editingProductId}`, productForm);
        if (data.success) {
          showToast('Harvest details updated successfully!', 'success');
        }
      } else {
        // Create
        const data = await api.post('/products', productForm);
        if (data.success) {
          showToast('New agricultural product published to marketplace! 🌱', 'success');
        }
      }
      setProductModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product from the marketplace?')) return;
    try {
      const data = await api.delete(`/products/${id}`);
      if (data.success) {
        showToast('Product removed.', 'info');
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      const data = await api.put(`/orders/${orderId}/status`, { status: nextStatus });
      if (data.success) {
        showToast(`Order status transitioned to: ${nextStatus.replace(/_/g, ' ')}`, 'success');
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grower Control Center</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white mt-1">
            {user?.farmer?.farmName || 'Farmer'} Hub
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your crop inventory, fulfill incoming orders, and track your direct farm earnings.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3.5 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-xs shadow-farm hover:shadow-farm-hover transition flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Harvest</span>
        </button>
      </div>

      {/* Summary KPI Cards (DESIGN.md Section 24) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Sales */}
        <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Farm Revenue</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              ₹{stats.totalSales.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">100% Direct to Bank</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Incoming Orders</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              {stats.totalOrders}
            </div>
            <span className="text-[10px] text-amber-500 font-bold">Live Harvest Pipeline</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Listed Products */}
        <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active Listings</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              {products.length}
            </div>
            <span className="text-[10px] text-sky-500 font-bold">Catalog Available</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Customers */}
        <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Customer Base</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
              {stats.totalCustomers || 1}
            </div>
            <span className="text-[10px] text-purple-500 font-bold">Conscious Buyers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* SECTION 1: INVENTORY MANAGEMENT TABLE (DESIGN.md Section 26) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-poppins text-gray-900 dark:text-white">
              Farm Inventory & Stock Control
            </h2>
            <p className="text-xs text-gray-500">
              Real-time stock decreases automatically when orders are placed.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-kissan-dark-border text-gray-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Crop / Product</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Price</th>
                <th className="pb-3 px-2">Available Stock</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-kissan-dark-border">
              {products.map((prod) => {
                const isOut = prod.quantity <= 0;
                const isLow = prod.quantity > 0 && prod.quantity <= 10;
                return (
                  <tr key={prod._id} className="hover:bg-gray-50/50 dark:hover:bg-emerald-950/20 transition">
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0]}
                          alt={prod.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{prod.name}</p>
                          <p className="text-[10px] text-gray-400">{prod.organic ? '✓ Organic' : 'Conventional'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-gray-600 dark:text-gray-300 font-medium">
                      {prod.category}
                    </td>
                    <td className="py-3.5 px-2 font-bold text-gray-900 dark:text-white">
                      ₹{prod.price} / {prod.unit}
                    </td>
                    <td className="py-3.5 px-2 font-bold">
                      {prod.quantity} {prod.unit}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isOut
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : isLow
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: INCOMING ORDERS MANAGEMENT (DESIGN.md Section 27) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold font-poppins text-gray-900 dark:text-white">
            Incoming Orders & Status Pipeline
          </h2>
          <p className="text-xs text-gray-500">
            Progress customer orders through each phase: Pending → Confirmed → Preparing → Out for Delivery → Delivered.
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const cust = order.customerId || {};
              return (
                <div
                  key={order._id}
                  className="p-5 rounded-2xl border border-gray-100 dark:border-kissan-dark-border bg-gray-50/50 dark:bg-kissan-dark-surface space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200/50 dark:border-gray-800">
                    <div>
                      <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        Buyer: {cust.name || 'Customer'} ({order.deliveryAddress?.city})
                      </span>
                    </div>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>

                  {/* Items for this farmer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {item.quantity} {item.unit || 'kg'} • ₹{item.subtotal}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status Progression Workflow Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/50 dark:border-gray-800">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Total: ₹{order.totalAmount}
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'accepted')}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Harvest Order</span>
                        </button>
                      )}

                      {order.orderStatus === 'accepted' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Start Harvesting & Packing</span>
                        </button>
                      )}

                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'ready')}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Ready for Dispatch</span>
                        </button>
                      )}

                      {order.orderStatus === 'ready' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'out_for_delivery')}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Hand Over: Out for Delivery</span>
                        </button>
                      )}

                      {order.orderStatus === 'out_for_delivery' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Delivered to Customer</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-emerald-950/20 text-center text-xs text-gray-500">
            No incoming orders yet. As customers order your crops, they will show up here.
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProductId ? 'Edit Harvest Product' : 'Add New Agricultural Produce'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="e.g. Organic Desi Tomatoes"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
              >
                {CATEGORIES.filter(c => c.name !== 'All').map((c) => (
                  <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="e.g. 60"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Unit *
              </label>
              <select
                value={productForm.unit}
                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
              >
                <option value="kg">kg</option>
                <option value="g">250g / 500g</option>
                <option value="dozen">dozen</option>
                <option value="liter">liter / ml</option>
                <option value="pack">pack / bunch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Available Stock *
              </label>
              <input
                type="number"
                min="0"
                value={productForm.quantity}
                onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                placeholder="e.g. 50"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Description & Harvest Story
            </label>
            <textarea
              rows="3"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Tell customers about the variety, flavor, pesticide-free practices, and harvest method..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Harvest Date
              </label>
              <input
                type="date"
                value={productForm.harvestDate}
                onChange={(e) => setProductForm({ ...productForm, harvestDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Image URL (Cloudinary / Web photo)
              </label>
              <input
                type="url"
                value={productForm.images[0] || ''}
                onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={productForm.organic}
              onChange={(e) => setProductForm({ ...productForm, organic: e.target.checked })}
              className="w-4 h-4 text-kissan-green rounded"
            />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              This crop is 100% Certified Organic & Chemical-Free
            </span>
          </label>

          <button
            type="submit"
            disabled={savingProduct}
            className="w-full py-3.5 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-xs shadow-farm transition"
          >
            {savingProduct ? 'Publishing Crop...' : editingProductId ? 'Save Product Changes' : 'Publish Product to Marketplace'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default FarmerDashboard;
