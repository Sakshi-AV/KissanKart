import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Sparkles, 
  RotateCcw,
  Check
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import CategoryPills, { CATEGORIES } from '../components/product/CategoryPills';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [organicOnly, setOrganicOnly] = useState(searchParams.get('organic') === 'true');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category && category !== 'All') queryParams.append('category', category);
        if (organicOnly) queryParams.append('organic', 'true');
        if (maxPrice < 1500) queryParams.append('maxPrice', maxPrice);
        if (sortBy) queryParams.append('sort', sortBy);

        const data = await api.get(`/products?${queryParams.toString()}`);
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error loading shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredProducts();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, category, organicOnly, maxPrice, sortBy]);

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setOrganicOnly(false);
    setMaxPrice(1500);
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = search || category !== 'All' || organicOnly || maxPrice < 1500 || sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white">
            Fresh Farm Marketplace
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse harvested produce directly from certified organic growers across India.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vegetables, mangoes, grains..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kissan-green shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <CategoryPills
        selectedCategory={category}
        onSelectCategory={(cat) => {
          setCategory(cat);
          setSearchParams(cat === 'All' ? {} : { category: cat });
        }}
      />

      {/* Toolbar (Mobile Filter toggle, Sort Selector, Results count) */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-kissan-dark-border">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Showing <strong className="text-gray-900 dark:text-white">{products.length}</strong> fresh agricultural products
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-kissan-green shadow-sm"
          >
            <option value="newest">Fresh Harvests (Newest)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated ⭐</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-kissan-dark-border">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-kissan-green" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Organic Switcher */}
            <div>
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">100% Organic Only</span>
                </div>
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="w-4 h-4 text-kissan-green rounded focus:ring-kissan-green"
                />
              </label>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Max Price</span>
                <span className="text-kissan-green dark:text-emerald-400">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-kissan-green cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>₹50</span>
                <span>₹1,500+</span>
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Categories
              </span>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      category === cat.name
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-emerald-950/30'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    {category === cat.name && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="search"
              title="No Farm Harvests Found"
              message="No products match your active search filters. Try widening your price range or resetting category filters."
              actionText="Reset All Filters"
              actionLink="#"
              onClick={resetFilters}
            />
          )}
        </div>

      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-kissan-dark-card h-full p-6 overflow-y-auto space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-kissan-dark-border">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Organic Switcher */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">100% Organic Only</span>
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="w-4 h-4 text-kissan-green rounded"
              />
            </label>

            {/* Price slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Max Price</span>
                <span className="text-kissan-green">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-kissan-green"
              />
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Category</p>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name);
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                    category === cat.name ? 'bg-kissan-green text-white font-bold' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                resetFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
