import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Banknote, 
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Multi-step: 1 = Address, 2 = Payment & Review
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Address form
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500">Please add fresh produce to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-kissan-green text-white font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Shop</span>
        </Link>
      </div>
    );
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city) {
      showToast('Please fill out all required address fields.', 'warning');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity
        })),
        deliveryAddress: address,
        paymentMethod,
        deliveryFee
      };

      const data = await api.post('/orders', orderPayload);
      if (data.success && data.order) {
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        clearCart();
        showToast('Your harvest order has been placed successfully! 🌾', 'success');
        navigate(`/order-confirmation/${data.order._id}`, { state: { order: data.order } });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Checkout Steps Progress */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-md mx-auto">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-kissan-green font-bold' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
            step >= 1 ? 'bg-kissan-green text-white shadow' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <span className="text-xs sm:text-sm">Delivery Address</span>
        </div>

        <div className="w-12 h-0.5 bg-gray-200 dark:bg-emerald-950"></div>

        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-kissan-green font-bold' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
            step >= 2 ? 'bg-kissan-green text-white shadow' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <span className="text-xs sm:text-sm">Payment & Confirm</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Step Form */}
        <div className="lg:col-span-8">
          
          {step === 1 ? (
            /* STEP 1: Delivery Address Form */
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-kissan-dark-border">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-poppins">
                    Where should the farm deliver?
                  </h2>
                  <p className="text-xs text-gray-500">Provide direct address for our zero-middleman dispatch route.</p>
                </div>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Recipient Name *
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Ananya Sharma"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="e.g. +91 99001 12233"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    House / Flat / Street Address *
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="e.g. Flat 402, Sunshine Apartments, 12th Main Road"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="e.g. Karnataka"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="e.g. 560038"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-xs shadow-farm hover:shadow-farm-hover transition flex items-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* STEP 2: Payment & Final Review */
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-kissan-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white font-poppins">
                      Select Payment Method
                    </h2>
                    <p className="text-xs text-gray-500">Secure direct agricultural settlement architecture.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-kissan-green hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Edit Address</span>
                </button>
              </div>

              {/* Delivery Address Summary Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 text-xs">
                <p className="font-bold text-gray-900 dark:text-white">{address.fullName} ({address.phone})</p>
                <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                  {address.street}, {address.city}, {address.state} - {address.pincode}
                </p>
              </div>

              {/* Payment Choices */}
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-kissan-green bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-kissan-green'
                    : 'border-gray-200 dark:border-kissan-dark-border hover:bg-gray-50 dark:hover:bg-emerald-950/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-kissan-green focus:ring-kissan-green"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-gray-500">Pay in cash when the fresh harvest arrives at your door</p>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-emerald-600" />
                </label>

                {/* Instant UPI Simulator */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'UPI'
                    ? 'border-kissan-green bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-kissan-green'
                    : 'border-gray-200 dark:border-kissan-dark-border hover:bg-gray-50 dark:hover:bg-emerald-950/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-kissan-green focus:ring-kissan-green"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">UPI / QR (GPay, PhonePe, Paytm)</p>
                      <p className="text-[11px] text-gray-500">Instant direct transfer to farmer collective</p>
                    </div>
                  </div>
                  <Smartphone className="w-5 h-5 text-amber-500" />
                </label>

                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border ml-6 space-y-2 animate-slide-up">
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300">
                      Enter UPI ID / Virtual Payment Address
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-kissan-dark-card border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Debit/Credit Card Simulator */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'CARD'
                    ? 'border-kissan-green bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-kissan-green'
                    : 'border-gray-200 dark:border-kissan-dark-border hover:bg-gray-50 dark:hover:bg-emerald-950/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="text-kissan-green focus:ring-kissan-green"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Credit / Debit Card</p>
                      <p className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Maestro</p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-sky-500" />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100 dark:border-kissan-dark-border flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="px-8 py-4 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-extrabold text-sm shadow-farm hover:shadow-farm-hover transition flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Placing Fresh Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Place Order (₹{total})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar: Order Summary Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-base text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-kissan-dark-border">
              Harvests in Your Order ({items.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {quantity} {product.unit || 'kg'} × ₹{product.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₹{product.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-kissan-dark-border space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-kissan-dark-border">
                <span>Total Due</span>
                <span className="text-kissan-green dark:text-emerald-400">₹{total}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
