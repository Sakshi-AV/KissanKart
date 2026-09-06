import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  LayoutDashboard, 
  PackagePlus, 
  ClipboardList, 
  ShieldCheck, 
  LogOut,
  Store,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, isFarmer, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-kissan-dark-card/90 border-b border-emerald-100 dark:border-kissan-dark-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-kissan-green-dark via-kissan-green to-emerald-400 flex items-center justify-center shadow-farm group-hover:scale-105 transition-transform duration-300">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-kissan-green-dark via-kissan-green to-emerald-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent font-poppins">
                Kissan Kart
              </span>
              <span className="text-[10px] uppercase tracking-widest text-kissan-yellow font-bold -mt-1">
                Direct Farm to Home
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/') 
                  ? 'bg-kissan-green-light text-kissan-green dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-kissan-green dark:hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/shop') 
                  ? 'bg-kissan-green-light text-kissan-green dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-kissan-green dark:hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              Shop Fresh
            </Link>

            <Link
              to="/farmers"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/farmers') 
                  ? 'bg-kissan-green-light text-kissan-green dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-kissan-green dark:hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              Our Farmers
            </Link>

            {/* Role specific link: Farmer Dashboard */}
            {isFarmer && (
              <Link
                to="/farmer/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname.startsWith('/farmer')
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 shadow-sm'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Farmer Hub
              </Link>
            )}

            {/* Role specific link: Admin Dashboard */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300 shadow-sm'
                    : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            {/* Customer Orders link */}
            {user && (
              <Link
                to="/orders"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                  isActive('/orders') 
                    ? 'bg-kissan-green-light text-kissan-green dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-kissan-green dark:hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-emerald-950/30'
                }`}
              >
                Orders
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-gray-700 dark:text-gray-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm animate-pulse-subtle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-gray-700 dark:text-gray-300 hover:text-kissan-green hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-kissan-green text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-kissan-green transition focus:outline-none"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <span className="hidden lg:block text-xs font-semibold text-gray-800 dark:text-gray-200 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-kissan-dark-card border border-emerald-100 dark:border-kissan-dark-border rounded-2xl shadow-xl py-2 z-50 animate-slide-up"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-kissan-dark-border">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                    >
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      My Orders
                    </Link>

                    {isFarmer && (
                      <Link
                        to="/farmer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Farmer Dashboard
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition font-medium"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-kissan-dark-border mt-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-kissan-green hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-kissan-green hover:bg-kissan-green-dark text-white shadow-sm hover:shadow transition"
                >
                  Join Farm
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-emerald-950/40 transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 dark:border-kissan-dark-border bg-white dark:bg-kissan-dark-card px-4 pt-3 pb-6 space-y-2 animate-slide-up">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
          >
            Shop Fresh
          </Link>
          <Link
            to="/farmers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
          >
            Our Farmers
          </Link>

          {isFarmer && (
            <Link
              to="/farmer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              Farmer Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
            >
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-100 dark:border-kissan-dark-border flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2.5 rounded-xl border border-kissan-green text-kissan-green font-semibold"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-2.5 rounded-xl bg-kissan-green text-white font-semibold shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
