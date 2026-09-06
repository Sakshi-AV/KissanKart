import React from 'react';

export const CATEGORIES = [
  { name: 'All', icon: '🧺', label: 'All Items' },
  { name: 'Vegetables', icon: '🥕', label: 'Fresh Veggies' },
  { name: 'Fruits', icon: '🍎', label: 'Seasonal Fruits' },
  { name: 'Grains', icon: '🌾', label: 'Heritage Grains' },
  { name: 'Pulses', icon: '🫘', label: 'Desi Pulses' },
  { name: 'Spices', icon: '🌶️', label: 'Pure Spices' },
  { name: 'Dairy', icon: '🥛', label: 'Farm Dairy' },
  { name: 'Organic Products', icon: '🌱', label: '100% Organic' },
  { name: 'Seeds', icon: '🌻', label: 'Native Seeds' },
  { name: 'Other Farm Products', icon: '🍯', label: 'Natural Goods' }
];

const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto pb-3 pt-1 scrollbar-none flex items-center gap-2.5">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all duration-200 border ${
              isSelected
                ? 'bg-kissan-green text-white border-kissan-green shadow-farm scale-105'
                : 'bg-white dark:bg-kissan-dark-card text-gray-700 dark:text-gray-300 border-emerald-100 dark:border-kissan-dark-border hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <span className="text-base leading-none">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
