import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, ArrowRight, ShoppingBag, MapPin, Calendar } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  const orderNumber = order?.orderNumber || `KK2026${id.substring(id.length - 5)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      
      {/* Celebration Icon */}
      <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border-4 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-farm animate-bounce-subtle">
        <CheckCircle className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
          Harvest Dispatched Notice
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white">
          ORDER PLACED!
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Your order has been received by our farmers. They will harvest, clean, and box your produce with care.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm max-w-md mx-auto text-left space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-kissan-dark-border">
          <span className="text-xs text-gray-500">Order ID:</span>
          <span className="text-sm font-black font-mono text-kissan-green dark:text-emerald-400">
            {orderNumber}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-kissan-dark-border">
          <span className="text-xs text-gray-500">Estimated Delivery:</span>
          <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            <span>2–3 Days (Fresh Route)</span>
          </span>
        </div>

        {order?.deliveryAddress && (
          <div className="text-xs text-gray-500 space-y-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Delivering to:</span>
            <p className="text-gray-900 dark:text-white font-medium">
              {order.deliveryAddress.fullName}, {order.deliveryAddress.street}, {order.deliveryAddress.city}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-xs shadow-farm hover:shadow-farm-hover transition flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Timeline</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gray-100 dark:bg-emerald-950/50 hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-800 dark:text-gray-200 font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
};

export default OrderConfirmation;
