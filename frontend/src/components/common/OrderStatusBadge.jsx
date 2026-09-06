import React from 'react';
import { Clock, CheckCircle, Package, Truck, Check, XCircle } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Order Placed',
          icon: <Clock className="w-3.5 h-3.5" />,
          classes: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60'
        };
      case 'accepted':
        return {
          label: 'Farm Confirmed',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          classes: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800/60'
        };
      case 'preparing':
        return {
          label: 'Harvesting & Packing',
          icon: <Package className="w-3.5 h-3.5 animate-pulse" />,
          classes: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/60'
        };
      case 'ready':
        return {
          label: 'Ready for Dispatch',
          icon: <Package className="w-3.5 h-3.5" />,
          classes: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800/60'
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          icon: <Truck className="w-3.5 h-3.5 animate-bounce-subtle" />,
          classes: 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800/60'
        };
      case 'delivered':
        return {
          label: 'Delivered Fresh',
          icon: <Check className="w-3.5 h-3.5" />,
          classes: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: <XCircle className="w-3.5 h-3.5" />,
          classes: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800/60'
        };
      default:
        return {
          label: status,
          icon: <Clock className="w-3.5 h-3.5" />,
          classes: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.classes} shadow-sm transition`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
