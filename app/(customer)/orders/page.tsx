"use client";

import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronRight, Package, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data (Self-Contained to avoid import errors) ---
type OrderStatus = 'Live' | 'Completed' | 'Cancelled';

type MockOrder = {
  id: string;
  restaurantName: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: string[];
};

// We include the order from your track-order page so it appears here
const initialOrders: MockOrder[] = [
  {
    id: '123546789', // This ID matches the track-order page
    restaurantName: 'Testing POS Restaurant',
    date: 'Nov 10, 2025',
    total: '$150.50',
    status: 'Live',
    items: ['French Fries x1', 'Chicken Biryani x2', 'Smoky Burger x1'],
  },
  {
    id: '987654321',
    restaurantName: 'Pizza Palace',
    date: 'Nov 09, 2025',
    total: '$45.00',
    status: 'Completed',
    items: ['Large Pepperoni', 'Garlic Knots'],
  },
  {
    id: '555123456',
    restaurantName: 'Sushi Spot',
    date: 'Nov 08, 2025',
    total: '$78.20',
    status: 'Completed',
    items: ['Dragon Roll', 'Spicy Tuna Roll', 'Miso Soup'],
  },
  {
    id: '777888999',
    restaurantName: 'Burger Joint',
    date: 'Nov 07, 2025',
    total: '$22.50',
    status: 'Cancelled', // Added a cancelled one
    items: ['Cheeseburger', 'Fries'],
  }
];

// --- Order Card Sub-Component ---
const OrderCard = ({ order }: { order: MockOrder }) => {
  const isLive = order.status === 'Live';

  const handleCardClick = () => {
    if (isLive) {
      // Navigate to the track-order page.
      // That page has its own self-contained data, so this works.
      window.location.href = '/track-order'; 
    } else {
      // Navigate to the order details page
      window.location.href = `/profile/orders/${order.id}`;
    }
  };
  
  // Determine status icon and color
  const getStatusInfo = () => {
    switch(order.status) {
      case 'Live':
        return { 
          icon: RefreshCw, 
          color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
          animate: true
        };
      case 'Completed':
        return { 
          icon: CheckCircle, 
          color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
          animate: false
        };
      case 'Cancelled':
        return { 
          icon: XCircle, 
          color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
          animate: false
        };
      default:
        return { 
          icon: Package, 
          color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
          animate: false
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between pb-3 border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          {/* Image Placeholder */}
          <div className={`w-12 h-12 rounded-lg ${statusInfo.color} flex items-center justify-center shrink-0`}>
            <statusInfo.icon className={`w-6 h-6 ${statusInfo.animate ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">{order.restaurantName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{order.date}</p>
          </div>
        </div>
        {/* Status */}
        <span 
          className={`text-xs font-semibold px-2 py-1 rounded-full ${statusInfo.color}`}
        >
          {order.status}
        </span>
      </div>
      <div className="pt-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {order.items.join(', ')}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{order.total}</span>
          <div className="flex items-center gap-1 text-sm font-semibold text-yellow-500">
            <span>{isLive ? 'Track Order' : 'View Details'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---
export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState<'Live' | 'Completed'>('Live');
  const [orders] = useState<MockOrder[]>(initialOrders);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'Live') {
      return orders.filter(o => o.status === 'Live');
    }
    // Completed tab shows both Completed and Cancelled
    return orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');
  }, [activeTab, orders]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <a href="/profile" aria-label="Go back to profile">
          <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order History</h1>
      </header>

      {/* Tab Navigation */}
      <nav className="p-4 md:px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-[69px] z-10">
        <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-full">
          <button
            onClick={() => setActiveTab('Live')}
            className={`w-1/2 rounded-full py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'Live' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
            } relative`}
          >
            {activeTab === 'Live' && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-md"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Live Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('Completed')}
            className={`w-1/2 rounded-full py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'Completed' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
            } relative`}
          >
            {activeTab === 'Completed' && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-md"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Completed</span>
          </button>
        </div>
      </nav>

      {/* Order List */}
      <main className="grow overflow-y-auto p-4 md:p-6">
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <CheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">No {activeTab} Orders</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {activeTab === 'Live' 
                    ? 'You have no orders currently on the way.'
                    : 'Your completed and cancelled orders will appear here.'
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}