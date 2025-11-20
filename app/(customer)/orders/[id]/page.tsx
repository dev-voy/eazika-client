"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeft, 
    CheckCircle, 
    RefreshCw, 
    XCircle, 
    Package, 
    MapPin, 
    CreditCard, 
    HelpCircle,
    Copy
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// --- Mock Data (Self-Contained to avoid import errors) ---
// This is copied from the Order History page to find the correct order
type OrderStatus = 'Live' | 'Completed' | 'Cancelled';

type MockOrder = {
  id: string;
  restaurantName: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: string[];
  // Adding more mock details for this page
  paymentMethod?: string;
  deliveryAddress?: string;
};

const initialOrders: MockOrder[] = [
  {
    id: '123546789',
    restaurantName: 'Testing POS Restaurant',
    date: 'Nov 10, 2025',
    total: '$150.50',
    status: 'Live',
    items: ['French Fries x1', 'Chicken Biryani x2', 'Smoky Burger x1'],
    paymentMethod: 'COD (Cash on Delivery)',
    deliveryAddress: '123 Main Street, Anytown, USA 12345',
  },
  {
    id: '987654321',
    restaurantName: 'Pizza Palace',
    date: 'Nov 09, 2025',
    total: '$45.00',
    status: 'Completed',
    items: ['Large Pepperoni x1', 'Garlic Knots x1'],
    paymentMethod: 'Visa ending in 1234',
    deliveryAddress: '456 Business Ave, Suite 500, Workville, USA 67890',
  },
  {
    id: '555123456',
    restaurantName: 'Sushi Spot',
    date: 'Nov 08, 2025',
    total: '$78.20',
    status: 'Completed',
    items: ['Dragon Roll x1', 'Spicy Tuna Roll x2', 'Miso Soup x1'],
    paymentMethod: 'Mastercard ending in 5678',
    deliveryAddress: '123 Main Street, Anytown, USA 12345',
  },
  {
    id: '777888999',
    restaurantName: 'Burger Joint',
    date: 'Nov 07, 2025',
    total: '$22.50',
    status: 'Cancelled',
    items: ['Cheeseburger x1', 'Fries x1'],
    paymentMethod: 'UPI (user@okbank)',
    deliveryAddress: '123 Main Street, Anytown, USA 12345',
  }
];

// --- Helper to get Status Icon ---
const getStatusInfo = (status: OrderStatus) => {
    switch(status) {
        case 'Live':
            return { icon: RefreshCw, color: 'text-yellow-500', animate: true };
        case 'Completed':
            return { icon: CheckCircle, color: 'text-green-500', animate: false };
        case 'Cancelled':
            return { icon: XCircle, color: 'text-red-500', animate: false };
        default:
            return { icon: Package, color: 'text-gray-500', animate: false };
    }
};

// --- Main Page Component ---
export default function OrderDetailsPage() {
  const [order, setOrder] = useState<MockOrder | null>(null);

  // Get Order ID from URL on client side
  useEffect(() => {
    // This is a workaround for the build environment not resolving 'useParams'
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    const foundOrder = initialOrders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, []);

  const handleCopyOrderId = () => {
    if (!order) return;
    const textArea = document.createElement('textarea');
    textArea.value = order.id;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('Order ID copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy Order ID.');
    }
    document.body.removeChild(textArea);
  };
  
  const handleReorder = () => {
    // In a real app, this would add items to cart and go to /cart
    toast.success('Items added to cart!');
    setTimeout(() => {
        window.location.href = '/cart';
    }, 1000);
  };

  if (!order) {
    // Loading or Not Found state
    return (
      <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
        <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <a href="/profile/orders" aria-label="Go back to orders">
            <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </a>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Details</h1>
        </header>
        <main className="p-4 md:p-6 text-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mt-20" />
            <h2 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">Loading Order Details...</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                If this takes a while, the order may not exist.
            </p>
        </main>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="bottom-center" />
      {/* Header */}
      <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <a href="/profile/orders" aria-label="Go back to orders">
          <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Details</h1>
      </header>

      {/* Main Content */}
      <main className="grow overflow-y-auto p-4 md:p-6 space-y-6 max-w-lg mx-auto">
        
        {/* Order Status Card */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700"
        >
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${statusInfo.color.replace('text-', 'bg-').replace('500', '100').replace('dark:bg-yellow-900/30', 'dark:bg-yellow-900/30')} flex items-center justify-center shrink-0`}>
                    <statusInfo.icon className={`w-7 h-7 ${statusInfo.color}`} />
                </div>
                <div>
                    <h2 className={`text-xl font-bold ${statusInfo.color}`}>{order.status}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">On {order.date}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white">{order.restaurantName}</h3>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {order.id}</p>
                    <button onClick={handleCopyOrderId} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>

        {/* Item List Card */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700"
        >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Order</h2>
            <ul className="space-y-3">
                {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        {/* Mock item price */}
                        <span className="font-medium text-gray-800 dark:text-white">${(parseFloat(order.total.replace('$', '')) / order.items.length).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{order.total}</span>
            </div>
        </motion.div>

        {/* Payment & Address Card */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 space-y-4"
        >
            {/* Payment Details */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Payment Details</h2>
                <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{order.paymentMethod}</span>
                </div>
            </div>

            {/* Delivery Address */}
            <div className="pt-4 border-t dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delivery Address</h2>
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{order.deliveryAddress}</span>
                </div>
            </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="space-y-3 pt-2"
        >
            {/* Show Re-order only if order was not cancelled */}
            {order.status !== 'Cancelled' && (
                <button
                    onClick={handleReorder}
                    className="w-full flex items-center justify-center gap-2 py-3 font-semibold bg-yellow-400 text-gray-900 rounded-full hover:bg-yellow-500 transition-colors shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" /> Re-order
                </button>
            )}
            <a
                href="/help" // Placeholder help page
                className="w-full flex items-center justify-center gap-2 py-3 font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
                <HelpCircle className="w-4 h-4" /> Get Help
            </a>
        </motion.div>

      </main>
    </div>
  );
}