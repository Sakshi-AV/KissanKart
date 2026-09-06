import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kissan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('kissan_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    if (!product || product.quantity <= 0) {
      showToast('This fresh product is currently out of stock.', 'warning');
      return;
    }

    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.product._id === product._id);
      if (existingIdx > -1) {
        const currentQty = prevItems[existingIdx].quantity;
        const newQty = currentQty + quantity;
        if (newQty > product.quantity) {
          showToast(`Only ${product.quantity} ${product.unit} available in stock.`, 'warning');
          return prevItems;
        }
        const updated = [...prevItems];
        updated[existingIdx].quantity = newQty;
        showToast(`Updated "${product.name}" quantity to ${newQty} in cart.`, 'success');
        return updated;
      } else {
        if (quantity > product.quantity) {
          showToast(`Only ${product.quantity} ${product.unit} available in stock.`, 'warning');
          return prevItems;
        }
        showToast(`Added ${product.name} to cart! 🛒`, 'success');
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product._id === productId) {
          if (newQty > item.product.quantity) {
            showToast(`Max available stock is ${item.product.quantity} ${item.product.unit}`, 'warning');
            return { ...item, quantity: item.product.quantity };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product._id === productId);
      if (item) {
        showToast(`Removed "${item.product.name}" from cart.`, 'info');
      }
      return prev.filter((i) => i.product._id !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 500 || items.length === 0 ? 0 : 30;
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        freeDeliveryThreshold: 500,
        amountNeededForFreeDelivery: Math.max(0, 500 - subtotal)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
