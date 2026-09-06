import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-kissan-dark-card rounded-2xl border border-emerald-100 dark:border-kissan-dark-border p-4 shadow-sm overflow-hidden skeleton-shimmer">
    <div className="w-full h-48 bg-gray-200 dark:bg-emerald-950/40 rounded-xl mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-emerald-950/40 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 dark:bg-emerald-950/40 rounded w-1/2 mb-4"></div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-6 bg-gray-200 dark:bg-emerald-950/40 rounded w-20"></div>
      <div className="h-9 bg-gray-200 dark:bg-emerald-950/40 rounded-xl w-24"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const DashboardCardSkeleton = () => (
  <div className="bg-white dark:bg-kissan-dark-card rounded-2xl p-6 border border-emerald-100 dark:border-kissan-dark-border shadow-sm skeleton-shimmer">
    <div className="h-4 bg-gray-200 dark:bg-emerald-950/40 rounded w-1/3 mb-3"></div>
    <div className="h-8 bg-gray-200 dark:bg-emerald-950/40 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 dark:bg-emerald-950/40 rounded w-2/3"></div>
  </div>
);
