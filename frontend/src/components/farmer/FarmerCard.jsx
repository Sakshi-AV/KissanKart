import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Star, PackageCheck, ArrowRight, Award } from 'lucide-react';

const FarmerCard = ({ farmer }) => {
  if (!farmer) return null;

  const user = farmer.userId || {};
  const farmerName = user.name || farmer.farmName;
  const profileImage = user.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="group relative bg-white dark:bg-kissan-dark-card rounded-3xl border border-emerald-100 dark:border-kissan-dark-border overflow-hidden hover:shadow-farm-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Banner / Header */}
      <div className="relative h-28 w-full overflow-hidden bg-gradient-to-r from-emerald-800 to-green-950">
        <img
          src={farmer.bannerImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600'}
          alt={farmer.farmName}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          {farmer.verificationStatus === 'verified' && (
            <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border border-emerald-400/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Farmer
            </span>
          )}
        </div>
      </div>

      {/* Avatar & Content */}
      <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
        <div>
          <div className="relative -mt-10 mb-3 flex items-end justify-between">
            <img
              src={profileImage}
              alt={farmerName}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-kissan-dark-card shadow-md"
            />
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 dark:text-amber-300 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{farmer.rating || 4.8}</span>
            </div>
          </div>

          <h3 className="font-poppins font-bold text-lg text-gray-900 dark:text-white group-hover:text-kissan-green dark:group-hover:text-emerald-400 transition-colors">
            {farmer.farmName}
          </h3>

          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-2">
            Led by {farmerName}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{farmer.location}</span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 italic">
            "{farmer.description}"
          </p>

          <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/40 text-xs">
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{farmer.experience || '5+ Yrs Exp'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
              <PackageCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{farmer.totalProducts || 0} Products</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <Link
          to={`/farmer/${farmer._id}`}
          className="mt-4 w-full py-2.5 px-4 rounded-2xl bg-emerald-50 hover:bg-kissan-green hover:text-white dark:bg-emerald-950/60 dark:hover:bg-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition flex items-center justify-center gap-2 group-hover:shadow-sm"
        >
          <span>Explore Farm & Harvests</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
