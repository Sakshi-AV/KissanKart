import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate('/shop');
    }
  };

  const handleDemo = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      if (role === 'farmer') navigate('/farmer/dashboard');
      else if (role === 'admin') navigate('/admin');
      else navigate('/shop');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-kissan-green-dark via-kissan-green to-emerald-400 flex items-center justify-center mx-auto shadow-farm">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black font-poppins text-gray-900 dark:text-white">
          Welcome to Kissan Kart
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Sign in to discover fresh crops or manage your farm inventory.
        </p>
      </div>

      {/* 1-Click Demo Login Box (For easy review) */}
      <div className="p-4 rounded-3xl bg-amber-50 dark:bg-emerald-950/40 border border-amber-200/80 dark:border-emerald-800/60 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>1-Click Reviewer Testing:</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleDemo('customer')}
            className="px-2.5 py-2 rounded-xl bg-white dark:bg-kissan-dark-card border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 transition shadow-sm"
          >
            👤 Customer
          </button>
          <button
            type="button"
            onClick={() => handleDemo('farmer')}
            className="px-2.5 py-2 rounded-xl bg-white dark:bg-kissan-dark-card border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900 transition shadow-sm"
          >
            🌾 Farmer
          </button>
          <button
            type="button"
            onClick={() => handleDemo('admin')}
            className="px-2.5 py-2 rounded-xl bg-white dark:bg-kissan-dark-card border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900 transition shadow-sm"
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <span className="text-[11px] text-kissan-green dark:text-emerald-400 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-kissan-dark-border text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kissan-green"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-kissan-green hover:bg-kissan-green-dark text-white font-bold text-xs shadow-farm hover:shadow-farm-hover transition flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In Securely'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 dark:border-kissan-dark-border text-xs text-gray-500">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-kissan-green hover:underline">
            Register as Customer or Farmer
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Login;
