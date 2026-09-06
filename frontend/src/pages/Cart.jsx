import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';

const Cart = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    deliveryFee, 
    total, 
    amountNeededForFreeDelivery,
    freeDeliveryThreshold
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState type="cart" />
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white">
            Your Farm Fresh Cart
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review your direct farm produce before proceeding to dispatch address.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Truck className="w-4 h-4 text-emerald-600" />
            {amountNeededForFreeDelivery === 0
              ? '🎉 You unlocked FREE Direct Farm Delivery!'
              : `Add ₹${amountNeededForFreeDelivery} more to unlock FREE Direct Delivery!`}
          </span>
          <span className="text-emerald-700 dark:text-emerald-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-emerald-200/60 dark:bg-emerald-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-kissan-green transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200'}
                  alt={product.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-emerald-100 dark:border-emerald-900/60 shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-kissan-green dark:text-emerald-400">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product._id}`}
                    className="block font-bold text-base text-gray-900 dark:text-white hover:text-kissan-green transition"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ₹{product.price} / {product.unit || 'kg'} • {product.farmerId?.farmName || 'Verified Farm'}
                  </p>
                </div>
              </div>

              {/* Quantity Selector & Item Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-kissan-dark-border">
                {/* Stepper */}
                <div className="flex items-center gap-2 border border-gray-200 dark:border-emerald-900/60 rounded-2xl p-1 bg-gray-50 dark:bg-kissan-dark-surface">
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-emerald-950/60 text-gray-600 dark:text-gray-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.quantity}
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-emerald-950/60 text-gray-600 dark:text-gray-300 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[70px]">
                  <span className="text-base font-extrabold text-gray-900 dark:text-white block">
                    ₹{product.price * quantity}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {quantity} {product.unit || 'kg'}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(product._id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-kissan-green hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More Farm Produce</span>
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6 sticky top-28">
            <h3 className="font-poppins font-bold text-lg text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-kissan-dark-border">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Produce Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span>Direct Farm Delivery</span>
                  {deliveryFee === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                      FREE
                    </span>
                  )}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-kissan-dark-border flex justify-between items-baseline">
                <div>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white block">
                    Estimated Total
                  </span>
                  <span className="text-[11px] text-gray-400">Including all agricultural taxes</span>
                </div>
                <span className="text-2xl font-black text-kissan-green dark:text-emerald-400">
                  ₹{total}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-sm shadow-farm hover:shadow-farm-hover transition flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Direct Farm Trust Point */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>100% Guaranteed fresh harvest or full instant replacement.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
