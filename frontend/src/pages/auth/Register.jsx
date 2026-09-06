import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, User, ShieldCheck, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const [role, setRole] = useState('customer'); // 'customer' | 'farmer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Farmer fields
    farmName: '',
    location: '',
    farmingType: '100% Certified Organic',
    experience: '5+ Years',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await register({
      ...formData,
      role
    });
    setSubmitting(false);

    if (res.success) {
      if (role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/shop');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-kissan-green-dark via-kissan-green to-emerald-400 flex items-center justify-center mx-auto shadow-farm">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
          Join Kissan Kart
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Connect directly with farmers or sell your fresh agricultural harvest without intermediaries.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-3xl bg-emerald-100/60 dark:bg-kissan-dark-card border border-emerald-200 dark:border-kissan-dark-border">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            role === 'customer'
              ? 'bg-kissan-green text-white shadow-farm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>I am a Customer</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('farmer')}
          className={`py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            role === 'farmer'
              ? 'bg-amber-600 text-white shadow-farm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>I am a Farmer / Grower</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Patel"
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
              />
            </div>
          </div>

          {/* Farmer-Specific Fields (DESIGN.md Section 29) */}
          {role === 'farmer' && (
            <div className="pt-4 border-t border-gray-100 dark:border-kissan-dark-border space-y-4 animate-slide-up">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Sprout className="w-4 h-4" />
                <span>Agricultural Farm Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Farm or Orchard Name *
                  </label>
                  <input
                    type="text"
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    placeholder="e.g. Sahyadri Agro Orchards"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Farm Village & District Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Nashik, Maharashtra"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Farming Technique
                  </label>
                  <select
                    value={formData.farmingType}
                    onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white"
                  >
                    <option value="100% Certified Organic">100% Certified Organic</option>
                    <option value="Vedic Natural Agriculture">Vedic Natural Agriculture</option>
                    <option value="Zero Budget Natural Farming">Zero Budget Natural Farming</option>
                    <option value="Permaculture">Permaculture & Agroforestry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Farming Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 8+ Years"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Farm Story / Crop Specialties
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share a few sentences about your native crops, soil care, and harvest values..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-bold text-xs text-white shadow-farm transition flex items-center justify-center gap-2 ${
              role === 'farmer'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-kissan-green hover:bg-kissan-green-dark'
            }`}
          >
            <span>{submitting ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Customer'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 dark:border-kissan-dark-border text-xs text-gray-500">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-kissan-green hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Register;
