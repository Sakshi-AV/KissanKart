import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  PackageCheck, 
  Award, 
  Sprout, 
  ArrowLeft,
  Mail,
  Phone
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

const FarmerProfile = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmer = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/farmers/${id}`);
        if (data.success) {
          setFarmer(data.farmer);
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching farmer profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Loading farmer profile...</p>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Farmer Profile Not Found</h2>
        <Link to="/farmers" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-kissan-green text-white font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Farmers</span>
        </Link>
      </div>
    );
  }

  const user = farmer.userId || {};
  const farmerName = user.name || farmer.farmName;
  const profileImage = user.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button */}
      <Link
        to="/farmers"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-kissan-green transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Farmers</span>
      </Link>

      {/* Hero Banner & Profile Header */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-md">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-emerald-900 to-green-950 overflow-hidden">
          <img
            src={farmer.bannerImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200'}
            alt={farmer.farmName}
            className="w-full h-full object-cover opacity-70"
          />
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-5">
              <img
                src={profileImage}
                alt={farmerName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white dark:border-kissan-dark-card shadow-xl"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black font-poppins text-gray-900 dark:text-white">
                    {farmer.farmName}
                  </h1>
                  {farmer.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Verified Organic Grower
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Stewarded by {farmerName}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{farmer.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-black text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{farmer.rating || 4.9}</span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Farm Rating</span>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 text-center">
                <div className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                  {products.length}
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Active Harvests</span>
              </div>
            </div>
          </div>

          {/* Farm Bio & Philosophy */}
          <div className="space-y-3 max-w-3xl pt-2">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-kissan-green dark:text-emerald-400">
              About Our Soil & Philosophy
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "{farmer.description}"
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5 font-semibold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Experience: {farmer.experience || '10+ Years'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Practices: {farmer.farmingType || 'Natural Vedic Organic'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Harvests Sold by this Farmer */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold font-poppins text-gray-900 dark:text-white">
            Available Harvests from {farmer.farmName} ({products.length})
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={{ ...prod, farmerId: farmer }} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 text-gray-500 text-sm">
            This farmer is currently harvesting fresh stock. Please check back shortly!
          </div>
        )}
      </div>

    </div>
  );
};

export default FarmerProfile;
