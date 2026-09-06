import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  Package, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import OrderTimeline from '../components/common/OrderTimeline';
import OrderStatusBadge from '../components/common/OrderStatusBadge';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/orders/${id}`);
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error loading order tracking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Tracking live farm dispatch...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
        <Link to="/orders" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-kissan-green text-white font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-kissan-green transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order History</span>
      </Link>

      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-kissan-dark-border">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-kissan-green dark:text-emerald-400">
              Live Farm Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-poppins text-gray-900 dark:text-white mt-0.5">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Placed on {new Date(order.createdAt).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</span>
            </p>
          </div>

          <OrderStatusBadge status={order.orderStatus} />
        </div>

        {/* Visual Progression Timeline */}
        <OrderTimeline currentStatus={order.orderStatus} timeline={order.timeline} />
      </div>

      {/* Detailed Grid: Items + Delivery info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ordered Items */}
        <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-4">
          <h3 className="font-poppins font-bold text-base text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-kissan-dark-border flex items-center gap-2">
            <Package className="w-4 h-4 text-kissan-green" />
            <span>Produce Package Items ({order.items.length})</span>
          </h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200'}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-100 dark:border-emerald-900/60 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white truncate max-w-[170px]">
                      {item.name}
                    </p>
                    <p className="text-gray-400">
                      {item.quantity} {item.unit || 'kg'} × ₹{item.price}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  ₹{item.subtotal}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-kissan-dark-border space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Direct Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-1">
              <span>Total Paid</span>
              <span className="text-kissan-green dark:text-emerald-400">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Address & Payment Details */}
        <div className="space-y-6">
          {/* Destination */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-3">
            <h3 className="font-poppins font-bold text-base text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-kissan-dark-border flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Address</span>
            </h3>
            {order.deliveryAddress && (
              <div className="text-xs space-y-1">
                <p className="font-bold text-gray-900 dark:text-white">
                  {order.deliveryAddress.fullName} ({order.deliveryAddress.phone})
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.deliveryAddress.street}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                </p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-3">
            <h3 className="font-poppins font-bold text-base text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-kissan-dark-border flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>Payment Details</span>
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Method:</span>
              <span className="font-bold text-gray-900 dark:text-white uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{order.paymentStatus}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderTracking;
