import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Truck, 
  Clock, 
  X,
  RotateCcw
} from 'lucide-react';
import api from '../services/api';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/orders/my');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be replenished to the farm.')) {
      return;
    }
    try {
      const data = await api.put(`/orders/${orderId}/cancel`);
      if (data.success) {
        showToast('Order cancelled successfully.', 'info');
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.orderStatus === filterStatus;
  });

  const statuses = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white">
            My Farm Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track fresh harvest deliveries from local farms to your doorstep.
          </p>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map((st) => (
          <button
            key={st.id}
            onClick={() => setFilterStatus(st.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition ${
              filterStatus === st.id
                ? 'bg-kissan-green text-white shadow-sm'
                : 'bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border text-gray-600 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-gray-100 dark:bg-emerald-950/40 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const canCancel = ['pending', 'accepted'].includes(order.orderStatus);
            return (
              <div
                key={order._id}
                className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm hover:shadow-farm transition-all space-y-4"
              >
                {/* Top Row: Order Number, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-kissan-dark-border">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-base text-gray-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.orderStatus} />
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200'}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-100 dark:border-emerald-900/60 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">
                          {item.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {item.quantity} {item.unit || 'kg'} • ₹{item.price}/{item.unit || 'kg'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Total & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-kissan-dark-border">
                  <div>
                    <span className="text-xs text-gray-400">Total Paid:</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white ml-2">
                      ₹{order.totalAmount}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-kissan-green hover:text-white text-emerald-800 dark:text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Status & Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          type="orders"
          message="You haven't placed any orders matching this status filter yet."
        />
      )}

    </div>
  );
};

export default Orders;
