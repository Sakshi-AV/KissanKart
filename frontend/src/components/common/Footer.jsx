import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart, ShieldCheck, Truck, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Prop Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-emerald-900/60">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center shrink-0 text-emerald-400">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fresh From Soil</h4>
              <p className="text-xs text-emerald-300/80">Harvested within 24-48 hrs</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Farmers</h4>
              <p className="text-xs text-emerald-300/80">Transparent authentic farms</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center shrink-0 text-sky-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Dispatch</h4>
              <p className="text-xs text-emerald-300/80">Zero intermediaries markup</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center shrink-0 text-rose-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fair Farm Prices</h4>
              <p className="text-xs text-emerald-300/80">100% farmer empowerment</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-emerald-900/60">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-kissan-green flex items-center justify-center shadow-farm">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Kissan Kart</span>
            </div>
            <p className="text-sm text-emerald-300/80 leading-relaxed max-w-sm">
              Connecting conscientious customers directly with local organic farmers across India. 
              Fresh, healthy, and ethically produced food straight to your kitchen table.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-emerald-300/90 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Agricultural Hub, Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@kissankart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 1800 572 2026 (Toll Free)</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-4">Shop Categories</h5>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li><Link to="/shop?category=Vegetables" className="hover:text-white transition">Vegetables</Link></li>
              <li><Link to="/shop?category=Fruits" className="hover:text-white transition">Seasonal Fruits</Link></li>
              <li><Link to="/shop?category=Grains" className="hover:text-white transition">Heritage Grains</Link></li>
              <li><Link to="/shop?category=Pulses" className="hover:text-white transition">Unpolished Pulses</Link></li>
              <li><Link to="/shop?category=Spices" className="hover:text-white transition">Native Spices</Link></li>
              <li><Link to="/shop?category=Dairy" className="hover:text-white transition">Desi Gir Cow Dairy</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-4">For Farmers</h5>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li><Link to="/register" className="hover:text-white transition">Register as a Farmer</Link></li>
              <li><Link to="/farmer/dashboard" className="hover:text-white transition">Farmer Portal</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">Direct Selling Guide</Link></li>
              <li><Link to="/farmers" className="hover:text-white transition">Farmer Stories</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Farmer Login</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li><Link to="/shop" className="hover:text-white transition">All Products</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">Track Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/70">
          <p>© 2026 Kissan Kart Inc. All rights reserved. Built with pride for Indian Farmers.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Farmer Fair Trade Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
