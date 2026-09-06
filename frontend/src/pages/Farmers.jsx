import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FarmerCard from '../components/farmer/FarmerCard';
import { Search, Sprout, ShieldCheck } from 'lucide-react';

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const data = await api.get('/farmers');
        if (data.success) {
          setFarmers(data.farmers);
        }
      } catch (err) {
        console.error('Error fetching farmers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((f) => {
    const s = search.toLowerCase();
    const farmName = (f.farmName || '').toLowerCase();
    const userName = (f.userId?.name || '').toLowerCase();
    const location = (f.location || '').toLowerCase();
    return farmName.includes(s) || userName.includes(s) || location.includes(s);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-kissan-green dark:text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Producer Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-gray-900 dark:text-white">
            Meet Our Farm Families
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Directly connect with independent organic farmers practicing sustainable agriculture across Karnataka, Punjab, Maharashtra, and beyond.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm name or location..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kissan-green shadow-sm"
          />
        </div>
      </div>

      {/* Farmers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-gray-200 dark:bg-emerald-950/40 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredFarmers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <FarmerCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 text-gray-500 text-sm">
          No farmers found matching your search.
        </div>
      )}
    </div>
  );
};

export default Farmers;
