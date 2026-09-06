import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check, MapPin, Sparkles, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addItem, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const cartItem = items.find((i) => i.product._id === product._id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  // Compute harvest freshness string
  const getHarvestText = () => {
    if (!product.harvestDate) return 'Fresh Harvest';
    const diffHours = Math.floor((Date.now() - new Date(product.harvestDate).getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return 'Harvested Today';
    if (diffHours < 48) return 'Harvested Yesterday';
    const days = Math.floor(diffHours / 24);
    return `Harvested ${days}d ago`;
  };

  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isOutOfStock = product.quantity <= 0;

  const farmerName = product.farmerId?.farmName || product.farmerId?.userId?.name || 'Local Verified Farmer';
  const farmerId = product.farmerId?._id || product.farmerId;

  return (
    <div className="group relative bg-white dark:bg-kissan-dark-card rounded-3xl border border-emerald-100/80 dark:border-kissan-dark-border overflow-hidden hover:shadow-farm-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image Section */}
      <div className="relative w-full h-52 bg-emerald-50/50 dark:bg-emerald-950/20 overflow-hidden">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Freshness / Harvest Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="inline-flex items-center gap-1 bg-white/95 dark:bg-emerald-950/90 backdrop-blur-md text-kissan-green-dark dark:text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-emerald-100 dark:border-emerald-800/60">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {getHarvestText()}
          </span>

          {product.organic && (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm">
              ✓ 100% Organic
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
            inWishlist
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-110'
              : 'bg-white/80 dark:bg-emerald-950/80 text-gray-600 dark:text-gray-300 hover:text-rose-500 hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs uppercase font-semibold tracking-wider text-kissan-green dark:text-emerald-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              {product.numReviews > 0 && (
                <span className="text-gray-400 dark:text-gray-500 font-normal">({product.numReviews})</span>
              )}
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="font-poppins font-bold text-base text-gray-900 dark:text-white group-hover:text-kissan-green dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Farmer & Location Badge */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <Link 
              to={`/farmer/${farmerId}`}
              className="hover:underline hover:text-kissan-green dark:hover:text-emerald-300 truncate"
            >
              {farmerName}
            </Link>
          </div>
        </div>

        {/* Pricing and Cart Button */}
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-kissan-dark-border flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                ₹{product.price}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                /{product.unit || 'kg'}
              </span>
            </div>

            {/* Stock badge */}
            {isLowStock && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                <AlertTriangle className="w-2.5 h-2.5" />
                Only {product.quantity} left
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addItem(product, 1)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : cartQty > 0
                ? 'bg-emerald-700 text-white hover:bg-emerald-800 ring-2 ring-emerald-400/40'
                : 'bg-kissan-green hover:bg-kissan-green-dark text-white hover:shadow-farm'
            }`}
          >
            {cartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added ({cartQty})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
