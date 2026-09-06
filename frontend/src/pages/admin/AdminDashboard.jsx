import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Sprout, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Check, 
  X, 
  Trash2, 
  Search,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('farmers');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, farmersRes, prodRes, ordersRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/farmers'),
        api.get('/products'),
        api.get('/orders/my'), // or list all orders
        api.get('/admin/users')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (farmersRes.success) setFarmers(farmersRes.farmers);
      if (prodRes.success) setProducts(prodRes.products);
      if (usersRes.success) setUsers(usersRes.users);
      if (statsRes.recentOrders) setOrders(statsRes.recentOrders);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyFarmer = async (farmerId, status) => {
    try {
      const data = await api.put(`/admin/farmers/${farmerId}/verify`, { status });
      if (data.success) {
        showToast(`Farmer verification updated to: ${status}`, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this product as Admin?')) return;
    try {
      const data = await api.delete(`/admin/products/${productId}`);
      if (data.success) {
        showToast('Product removed by Admin.', 'info');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Marketplace Platform Oversight</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white mt-1">
            Admin Governance Panel
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor transaction volume, verify sustainable grower profiles, and moderate listings.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm">
            <span className="text-[11px] text-gray-400 font-semibold">Total Revenue</span>
            <div className="text-xl font-black text-gray-900 dark:text-white mt-1">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm">
            <span className="text-[11px] text-gray-400 font-semibold">Total Orders</span>
            <div className="text-xl font-black text-amber-500 mt-1">
              {stats.totalOrders}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm">
            <span className="text-[11px] text-gray-400 font-semibold">Verified Farmers</span>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {stats.totalFarmers}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm">
            <span className="text-[11px] text-gray-400 font-semibold">Customers</span>
            <div className="text-xl font-black text-sky-500 mt-1">
              {stats.totalCustomers}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm">
            <span className="text-[11px] text-gray-400 font-semibold">Products</span>
            <div className="text-xl font-black text-indigo-500 mt-1">
              {stats.totalProducts}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm">
            <span className="text-[11px] text-gray-400 font-semibold">Delivered</span>
            <div className="text-xl font-black text-teal-500 mt-1">
              {stats.completedOrders}
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown & Status Visual */}
      {stats?.categoryCounts && (
        <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-3">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">
            Produce Distribution Across Categories
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(stats.categoryCounts).map(([cat, count]) => (
              <span
                key={cat}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5"
              >
                <span>{cat}</span>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Admin Management Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-kissan-dark-border pb-3">
          {[
            { id: 'farmers', label: `Farmers (${farmers.length})` },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'orders', label: `Recent Orders (${orders.length})` },
            { id: 'users', label: `All Users (${users.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-emerald-950/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Farmers Management */}
        {activeTab === 'farmers' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-kissan-dark-border text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-2">Farmer & Farm</th>
                  <th className="pb-3 px-2">Location</th>
                  <th className="pb-3 px-2">Farming Method</th>
                  <th className="pb-3 px-2">Verification</th>
                  <th className="pb-3 px-2 text-right">Verification Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-kissan-dark-border">
                {farmers.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50/50 dark:hover:bg-emerald-950/20">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={f.userId?.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200'}
                          alt={f.farmName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{f.farmName}</p>
                          <p className="text-[10px] text-gray-500">{f.userId?.name} ({f.userId?.email})</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">
                      {f.location}
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                      {f.farmingType || 'Organic'}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        f.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : f.verificationStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {f.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleVerifyFarmer(f._id, 'verified')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-[10px] font-bold transition"
                        >
                          Verify ✓
                        </button>
                        <button
                          onClick={() => handleVerifyFarmer(f._id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-[10px] font-bold transition"
                        >
                          Reject ✗
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Products Moderation */}
        {activeTab === 'products' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-kissan-dark-border text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-2">Product</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Price</th>
                  <th className="pb-3 px-2">Stock</th>
                  <th className="pb-3 px-2 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-kissan-dark-border">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-emerald-950/20">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-gray-400">{p.farmerId?.farmName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">
                      {p.category}
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">
                      ₹{p.price} / {p.unit}
                    </td>
                    <td className="py-3 px-2 font-bold">
                      {p.quantity} {p.unit}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Orders Overview */}
        {activeTab === 'orders' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-kissan-dark-border text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-2">Order #</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">City</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-kissan-dark-border">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50 dark:hover:bg-emerald-950/20">
                    <td className="py-3 px-2 font-mono font-bold text-gray-900 dark:text-white">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3 px-2 text-gray-800 dark:text-gray-200">
                      {o.customerId?.name || 'Customer'}
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {o.deliveryAddress?.city}
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">
                      ₹{o.totalAmount}
                    </td>
                    <td className="py-3 px-2">
                      <OrderStatusBadge status={o.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: Users Overview */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-kissan-dark-border text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-2">User</th>
                  <th className="pb-3 px-2">Email</th>
                  <th className="pb-3 px-2">Role</th>
                  <th className="pb-3 px-2">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-kissan-dark-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-emerald-950/20">
                    <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {u.email}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : u.role === 'farmer'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {u.phone || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
