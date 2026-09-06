import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? 'Switch to Fresh Harvest Light Mode' : 'Switch to Emerald Forest Dark Mode'}
      aria-label="Toggle Theme"
      className={`relative p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kissan-green ${
        isDark
          ? 'bg-kissan-dark-surface text-amber-300 hover:bg-emerald-950/80 border border-emerald-800/40 shadow-inner'
          : 'bg-kissan-green-light text-kissan-green-dark hover:bg-emerald-100/90 border border-emerald-200'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 scale-100 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
        ) : (
          <Sun className="w-5 h-5 transition-transform duration-500 rotate-90 scale-100 text-amber-600" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
