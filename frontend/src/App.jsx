import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import DemoSwitcher from './components/common/DemoSwitcher';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Farmers from './pages/Farmers';
import FarmerProfile from './pages/FarmerProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <div className="min-h-screen flex flex-col bg-[#FAFAF7] dark:bg-[#0A130C] text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  {/* Demo Switcher Quick Toolbar for Reviewer Convenience */}
                  <DemoSwitcher />

                  {/* Main Header Navbar */}
                  <Navbar />

                  {/* Main View Area */}
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/farmers" element={<Farmers />} />
                      <Route path="/farmer/:id" element={<FarmerProfile />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Protected Routes */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order-confirmation/:id"
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
                            <OrderConfirmation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
                            <OrderTracking />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'farmer', 'admin']}>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />

                      {/* Farmer Portal */}
                      <Route
                        path="/farmer/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                            <FarmerDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Portal */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Catch-all Fallback */}
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </main>

                  {/* Footer */}
                  <Footer />
                </div>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
