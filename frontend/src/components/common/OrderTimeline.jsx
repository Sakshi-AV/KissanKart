import React from 'react';
import { Check, Clock, Package, Truck, Home } from 'lucide-react';

const OrderTimeline = ({ currentStatus, timeline = [] }) => {
  const steps = [
    { key: 'pending', title: 'Order Placed', icon: Clock, desc: 'Order received at farm' },
    { key: 'accepted', title: 'Farm Confirmed', icon: Check, desc: 'Farmer confirmed availability' },
    { key: 'preparing', title: 'Harvesting & Packing', icon: Package, desc: 'Harvested fresh & boxed' },
    { key: 'out_for_delivery', title: 'Out for Delivery', icon: Truck, desc: 'On direct transport route' },
    { key: 'delivered', title: 'Delivered Fresh', icon: Home, desc: 'Reached customer doorstep' },
  ];

  const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 text-sm">
        <p className="font-bold">This order has been cancelled.</p>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
          Stock has been restored to the farmer’s inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
        
        {/* Connecting Progress Line for Desktop */}
        <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-gray-200 dark:bg-emerald-950/70 -z-0">
          <div
            className="h-full bg-gradient-to-r from-kissan-green to-emerald-400 transition-all duration-500 rounded-full"
            style={{
              width: `${Math.min(100, (Math.max(0, currentIndex) / (steps.length - 1)) * 100)}%`
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const stepIndex = statusOrder.indexOf(step.key);
          const isDone = currentIndex >= stepIndex;
          const isCurrent = currentStatus === step.key || (currentStatus === 'ready' && step.key === 'preparing');
          const StepIcon = step.icon;

          // Find corresponding timeline timestamp
          const event = timeline.find((e) => e.status === step.key);

          return (
            <div key={step.key} className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-2 z-10 sm:text-center flex-1">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-md ${
                  isDone
                    ? 'bg-kissan-green text-white ring-4 ring-emerald-100 dark:ring-emerald-900/50'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-900/50 animate-pulse'
                    : 'bg-white dark:bg-kissan-dark-surface text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-emerald-900/40'
                }`}
              >
                <StepIcon className="w-5 h-5" />
              </div>

              <div>
                <h5 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                  {step.title}
                </h5>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
                  {step.desc}
                </p>
                {event && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
