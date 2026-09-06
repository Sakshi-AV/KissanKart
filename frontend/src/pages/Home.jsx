import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Truck, 
  Sparkles, 
  Star, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Award,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import FarmerCard from '../components/farmer/FarmerCard';
import { CATEGORIES } from '../components/product/CategoryPills';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, farmRes] = await Promise.all([
          api.get('/products'),
          api.get('/farmers')
        ]);
        if (prodRes.success) setProducts(prodRes.products.slice(0, 8));
        if (farmRes.success) setFarmers(farmRes.farmers.slice(0, 3));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-400/20 via-kissan-green/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              {/* Freshness Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/60 text-kissan-green-dark dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Zero Middlemen • 100% Direct From Real Indian Soil</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-poppins text-gray-900 dark:text-white tracking-tight leading-[1.12]">
                From Our <span className="bg-gradient-to-r from-kissan-green-dark via-kissan-green to-emerald-500 bg-clip-text text-transparent">Farms</span> To Your <span className="text-amber-500">Home.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed font-normal">
                Buy fresh organic vegetables, heritage grains, tree-ripened fruits, and pure A2 dairy directly from trusted, verified farmers. Fair prices for consumers, rightful profit for growers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-8 py-4 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white text-base font-bold shadow-farm hover:shadow-farm-hover transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Shop Fresh Products</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-white dark:bg-kissan-dark-surface hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-kissan-green-dark dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Sell Your Products</span>
                </Link>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 border-t border-gray-200/80 dark:border-kissan-dark-border grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-kissan-green dark:text-emerald-400">100%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Chemical Free</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-500">24-48h</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Harvest to Door</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300">0%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Middlemen Commission</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-kissan-dark-card aspect-square sm:aspect-[4/3] lg:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000"
                    alt="Fresh organic vegetable harvest"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Overlay badge at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-kissan-dark-card/90 backdrop-blur-md border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Direct Harvest Guaranteed</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Hubballi & Nashik Farms</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-kissan-green dark:text-emerald-400">
                      ₹ Fair Price
                    </span>
                  </div>
                </div>

                {/* Floating Micro-Badge */}
                <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 p-3 sm:p-4 rounded-2xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-xl flex items-center gap-3 animate-float">
                  <span className="text-2xl">🥕</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Morning Harvested</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Packed with Dew</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-kissan-green dark:text-emerald-400 font-bold">
              Farm Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-poppins mt-1">
              Popular Farm Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-kissan-green hover:text-kissan-green-dark dark:text-emerald-400 transition"
          >
            <span>Browse All Departments</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.filter(c => c.name !== 'All').map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="group p-5 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100/70 dark:border-kissan-dark-border text-center hover:shadow-farm hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-kissan-green dark:group-hover:text-emerald-400 transition-colors">
                {cat.name}
              </h4>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FRESH PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-500 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct From Field</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-poppins mt-1">
              Fresh Harvests Available Today
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-kissan-green hover:text-kissan-green-dark dark:text-emerald-400 transition"
          >
            <span>View Full Market ({products.length > 0 ? '12+' : 'Loading'})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 4. FEATURED FARMERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-kissan-green dark:text-emerald-400 font-bold">
              Meet The Growers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-poppins mt-1">
              Featured Verified Farmers
            </h2>
          </div>
          <Link
            to="/farmers"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-kissan-green hover:text-kissan-green-dark dark:text-emerald-400 transition"
          >
            <span>Meet All Farmers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <FarmerCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
      </section>

      {/* 5. WHY KISSAN KART (DESIGN.md Section 16) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-kissan-green dark:text-emerald-400 font-bold">
            The Direct Advantage
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-poppins mt-2">
            Why Choose Kissan Kart?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Traditional supply chains pass produce through 5-7 middlemen, wasting freshness and taking 60% of farmer profit. Here is how we change it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm hover:shadow-farm transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">Fresh From Farms</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Harvested when fully ripe, not weeks early into artificial gas chambers. Unmatched aroma and nutrition.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm hover:shadow-farm transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">Direct Connection</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Know the exact village, farmer, and soil where your family's food originated. Real trust, zero opacity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm hover:shadow-farm transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">Fair Pricing</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Eliminating middlemen markups gives farmers respectable earnings while keeping customer groceries affordable.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm hover:shadow-farm transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">Trusted Farmers</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Every farmer profile is verified for organic practices, native seeds, and transparent farming techniques.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (DESIGN.md Section 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-900 to-green-950 text-white shadow-xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Simple Transparent Process</span>
            <h2 className="text-3xl font-extrabold font-poppins mt-2">How Kissan Kart Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 text-center relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-extrabold text-amber-400 mb-3 shadow-inner">
                01
              </div>
              <h4 className="font-bold text-sm mb-1">Farmer</h4>
              <p className="text-xs text-emerald-200/80">Lists fresh farm produce with harvest dates</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-extrabold text-amber-400 mb-3 shadow-inner">
                02
              </div>
              <h4 className="font-bold text-sm mb-1">Customer</h4>
              <p className="text-xs text-emerald-200/80">Discovers products & verified grower stories</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-extrabold text-amber-400 mb-3 shadow-inner">
                03
              </div>
              <h4 className="font-bold text-sm mb-1">Order</h4>
              <p className="text-xs text-emerald-200/80">Customer places order with easy checkout</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-extrabold text-amber-400 mb-3 shadow-inner">
                04
              </div>
              <h4 className="font-bold text-sm mb-1">Harvest</h4>
              <p className="text-xs text-emerald-200/80">Farmer harvests and packs in eco-crates</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-extrabold text-amber-400 mb-3 shadow-inner">
                05
              </div>
              <h4 className="font-bold text-sm mb-1">Delivery</h4>
              <p className="text-xs text-emerald-200/80">Direct dispatch reaches your dining table</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (DESIGN.md Section 23) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-kissan-green dark:text-emerald-400 font-bold">Community Love</span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-poppins mt-2">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic mb-4">
                "The Desi Tomatoes from Ravi Kumar arrived with their green stems still fragrant! I haven't tasted real tomatoes like this since my childhood in our native village."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-kissan-dark-border">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
                alt="Ananya Sharma"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Ananya Sharma</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Bengaluru • Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic mb-4">
                "The Alphonso mangoes from Ramesh Patel are unadulterated perfection. Zero artificial ripening chemicals, pure golden sweetness. Truly worth every single rupee!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-kissan-dark-border">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
                alt="Rahul Verma"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Rahul Verma</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Mumbai • Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic mb-4">
                "Knowing that my payment reaches Sunita Devi directly without exploitative traders taking a cut gives me genuine joy. The Lakadong turmeric is incredible."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-kissan-dark-border">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                alt="Pooja Iyer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Pooja Iyer</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Hyderabad • Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FARMER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-amber-50 dark:bg-emerald-950/40 border border-amber-200/80 dark:border-emerald-800/60 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left">
            <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-extrabold">
              Farmer Partnership
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-poppins">
              Are You a Farmer? Sell Directly to Thousands.
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
              Set your own prices, manage your inventory with our simple portal, and connect with conscious consumers who value your hard work.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold shadow-farm hover:shadow-farm-hover transition"
            >
              Register As Farmer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
