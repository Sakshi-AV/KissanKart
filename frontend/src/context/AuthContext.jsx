import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kissan_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Validate and fetch user on boot
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, clearing token');
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('kissan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}! 🌾`, 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const data = await api.post('/auth/register', formData);
      if (data.success) {
        localStorage.setItem('kissan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast('Registration successful! Welcome to Kissan Kart 🌱', 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const demoLogin = async (role) => {
    try {
      const data = await api.post('/auth/demo-login', { role });
      if (data.success) {
        localStorage.setItem('kissan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Signed in as Demo ${role.toUpperCase()} (${data.user.name})`, 'info');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const data = await api.put('/auth/profile', updateData);
      if (data.success) {
        setUser(data.user);
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('kissan_token');
    setToken(null);
    setUser(null);
    showToast('Logged out securely.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        login,
        register,
        demoLogin,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
