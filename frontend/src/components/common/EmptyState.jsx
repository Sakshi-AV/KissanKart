import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, PackageOpen, SearchX, ArrowRight } from 'lucide-react';

const EmptyState = ({
  type = 'general',
  title,
  message,
  actionText = 'Explore Products',
  actionLink = '/shop',
  icon
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'cart':
        return {
          icon: <ShoppingBag className="w-12 h-12 text-emerald-500" />,
          title: 'Your Cart is Empty',
          message: 'Discover fresh harvested produce and organic spices directly from local farmers.',
          actionText: 'Start Shopping',
          actionLink: '/shop'
        };
      case 'wishlist':
        return {
          icon: <Heart className="w-12 h-12 text-rose-500" />,
          title: 'No Products Saved Yet',
          message: 'Save your favorite organic fruits, veggies, and grains to buy them later.',
          actionText: 'Explore Farm Catalog',
          actionLink: '/shop'
        };
      case 'orders':
        return {
          icon: <PackageOpen className="w-12 h-12 text-amber-500" />,
          title: "You Haven't Placed Any Orders Yet",
          message: 'Support local farming families by purchasing your groceries directly from our fields.',
          actionText: 'Browse Fresh Products',
          actionLink: '/shop'
        };
      case 'search':
        return {
          icon: <SearchX className="w-12 h-12 text-gray-400" />,
          title: 'No Products Found',
          message: 'Try adjusting your search terms, price filters, or category selection.',
          actionText: 'Reset Filters',
          actionLink: '/shop'
        };
      default:
        return {
          icon: <PackageOpen className="w-12 h-12 text-emerald-500" />,
          title: title || 'Nothing Here Yet',
          message: message || 'Check back soon for fresh updates!',
          actionText: actionText || 'Back to Home',
          actionLink: actionLink || '/'
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-kissan-dark-card/60 border border-emerald-100 dark:border-kissan-dark-border backdrop-blur-sm max-w-lg mx-auto my-8">
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center mb-6 shadow-inner">
        {icon || content.icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 font-poppins">
        {title || content.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {message || content.message}
      </p>
      {content.actionLink && (
        <Link
          to={actionLink || content.actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-semibold shadow-farm hover:shadow-farm-hover transition group"
        >
          <span>{actionText || content.actionText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
