import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState type="wishlist" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white flex items-center gap-2">
            <span>My Saved Harvests</span>
            <span className="text-sm px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold">
              {wishlist.length}
            </span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep track of seasonal crops and quickly move them to your cart.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((prod) => (
          <div
            key={prod._id}
            className="group bg-white dark:bg-kissan-dark-card rounded-3xl border border-emerald-100 dark:border-kissan-dark-border overflow-hidden shadow-sm hover:shadow-farm transition-all flex flex-col justify-between"
          >
            <div className="relative h-48 w-full overflow-hidden bg-emerald-50/50 dark:bg-emerald-950/20">
              <img
                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600'}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => removeFromWishlist(prod._id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-kissan-dark-card/80 text-rose-500 hover:bg-rose-500 hover:text-white transition shadow"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-kissan-green dark:text-emerald-400">
                  {prod.category}
                </span>
                <Link to={`/product/${prod._id}`} className="block">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1 hover:text-kissan-green transition">
                    {prod.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ₹{prod.price} / {prod.unit || 'kg'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-kissan-dark-border">
                <button
                  onClick={() => addItem(prod, 1)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Wishlist;
