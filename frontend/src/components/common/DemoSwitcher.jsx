import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Sprout, ShieldCheck, Sparkles } from 'lucide-react';

const DemoSwitcher = () => {
  const { user, demoLogin, logout } = useAuth();

  return (
    <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 border-b border-emerald-800/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="font-medium text-emerald-300">Live Demo Roles:</span>
          <span className="text-emerald-400/80 hidden sm:inline">Switch persona to test role-specific features:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => demoLogin('customer')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium ${
              user?.role === 'customer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => demoLogin('farmer')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium ${
              user?.role === 'farmer'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border border-amber-700/40'
            }`}
          >
            <Sprout className="w-3 h-3" />
            <span>Farmer (Ravi)</span>
          </button>

          <button
            onClick={() => demoLogin('admin')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium ${
              user?.role === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-emerald-900/60 hover:bg-emerald-800 text-purple-200 border border-purple-700/40'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>

          {user && (
            <button
              onClick={logout}
              className="text-emerald-400 hover:text-rose-300 underline text-[11px] ml-1 transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoSwitcher;
