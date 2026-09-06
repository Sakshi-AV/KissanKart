import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Plus, 
  Minus, 
  ArrowLeft,
  MessageSquarePlus,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Review modal states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/products/${id}`);
        if (data.success) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Loading fresh harvest details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Not Found</h2>
        <p className="text-sm text-gray-500">This harvest listing may have expired or sold out.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-kissan-green text-white font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const farmer = product.farmerId || {};
  const inWishlist = isInWishlist(product._id);
  const isOutOfStock = product.quantity <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write a brief comment about your experience.', 'warning');
      return;
    }
    setSubmittingReview(true);
    try {
      const data = await api.post('/reviews', {
        productId: product._id,
        rating,
        comment
      });
      if (data.success) {
        showToast('Thank you! Your verified review is published.', 'success');
        setReviewModalOpen(false);
        setComment('');
        // Refresh product to reflect new review
        const refreshed = await api.get(`/products/${id}`);
        if (refreshed.success) setProduct(refreshed.product);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const harvestDateStr = product.harvestDate
    ? new Date(product.harvestDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recent Harvest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb / Back Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-kissan-green dark:hover:text-emerald-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farm Marketplace</span>
      </Link>

      {/* Main Grid: Gallery + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-kissan-dark-border shadow-md">
            <img
              src={product.images?.[activeImage] || product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.organic && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wide px-3 py-1 rounded-full shadow-md">
                ✓ 100% Certified Organic
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    activeImage === idx
                      ? 'border-kissan-green ring-2 ring-emerald-400/40 scale-105'
                      : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-kissan-green dark:text-emerald-400">
                {product.category}
              </span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating || 5.0}</span>
                <span className="text-gray-400 font-normal">({product.reviews?.length || product.numReviews || 0} customer reviews)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-poppins text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Location & Harvest Date Tag */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-1 font-medium">
                <Calendar className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Harvested: {harvestDateStr}</span>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="p-5 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                ₹{product.price}
              </span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                per {product.unit || 'kg'}
              </span>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isOutOfStock
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {isOutOfStock ? 'Sold Out' : `${product.quantity} ${product.unit} In Stock`}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Harvest Story & Description
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Farming Attributes */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Farming Method</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {product.farmingMethod || 'Natural Composting'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Delivery Route</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct Dispatch within 24h
              </p>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-kissan-dark-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-gray-200 dark:border-emerald-900/60 rounded-2xl p-1 bg-white dark:bg-kissan-dark-card">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-emerald-950/50 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.quantity || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-emerald-950/50 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-gray-400 font-medium">
                Total: <strong className="text-gray-900 dark:text-white font-bold">₹{product.price * quantity}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white font-bold shadow-farm hover:shadow-farm-hover transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? 'Sold Out' : `Add ${quantity} ${product.unit || 'kg'} to Cart`}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl border transition shadow-sm ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-800'
                    : 'bg-white dark:bg-kissan-dark-card border-gray-200 dark:border-kissan-dark-border text-gray-600 dark:text-gray-300 hover:text-rose-500'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Farmer Card Summary */}
          {farmer && (
            <div className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={farmer.bannerImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200'}
                  alt={farmer.farmName}
                  className="w-12 h-12 rounded-2xl object-cover border border-emerald-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {farmer.farmName || 'Verified Farm'}
                    </h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    📍 {farmer.location}
                  </p>
                </div>
              </div>

              <Link
                to={`/farmer/${farmer._id}`}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition"
              >
                View Farmer Profile
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* Reviews & Ratings Section */}
      <div className="pt-12 border-t border-gray-100 dark:border-kissan-dark-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">
              Customer Reviews ({product.reviews?.length || 0})
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Feedback from verified buyers of this specific agricultural produce.
            </p>
          </div>

          {user ? (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="text-xs text-kissan-green hover:underline font-bold"
            >
              Log in to write a review
            </Link>
          )}
        </div>

        {/* Reviews Grid */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                      {rev.customerName ? rev.customerName[0] : 'C'}
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {rev.customerName}
                    </span>
                  </div>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(rev.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-emerald-950/20 text-center text-xs text-gray-500 dark:text-gray-400">
            No reviews yet for this harvest. Be the first to share your experience!
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Share Your Farm Produce Experience"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-7 h-7 ${
                      rating >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-amber-600">{rating} of 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Your Review & Comments
            </label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the freshness, taste, packaging, and harvest quality..."
              className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="w-full py-3 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-xs shadow-farm transition"
          >
            {submittingReview ? 'Publishing Review...' : 'Submit Verified Review'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default ProductDetails;
