"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ClipboardList, 
    CheckCircle, 
    RefreshCw, 
    ChevronRight,
    Search,
    Clock,
    Truck, // For Pending/Action required
    XCircle // For Cancelled
} from 'lucide-react';

// --- Mock Data (Self-Contained) ---
type OrderStatus = 'Pending' | 'Preparing' | 'Completed' | 'Cancelled';

type MockShopOrder = {
  id: string;
  customerName: string;
  timeAgo: string;
  total: string;
  status: OrderStatus;
  items: string[];
};

const allShopOrders: MockShopOrder[] = [
  {
    id: 'EAZ123',
    customerName: 'Ratul Islam',
    timeAgo: '5m ago',
    total: '$45.00',
    status: 'Pending',
    items: ['Lays Potato Chips x2', 'Coca-Cola Can x4'],
  },
  {
    id: 'EAZ122',
    customerName: 'Jane Doe',
    timeAgo: '15m ago',
    total: '$120.00',
    status: 'Preparing',
    items: ['Cadbury Dairy Milk x10', 'Nivea Body Cream x1'],
  },
  {
    id: 'EAZ121',
    customerName: 'John Smith',
    timeAgo: '1h ago',
    total: '$22.50',
    status: 'Completed',
    items: ['Coca-Cola Can x6'],
  },
  {
    id: 'EAZ120',
    customerName: 'Alice Brown',
    timeAgo: '2h ago',
    total: '$85.75',
    status: 'Pending',
    items: ['Nivea Body Cream x3', 'Lays Potato Chips x5'],
  },
  {
    id: 'EAZ119',
    customerName: 'Mike Johnson',
    timeAgo: '4h ago',
    total: '$32.00',
    status: 'Completed',
    items: ['Cadbury Dairy Milk x4'],
  },
  {
    id: 'EAZ118',
    customerName: 'Sara Wilson',
    timeAgo: '1d ago',
    total: '$15.00',
    status: 'Cancelled',
    items: ['Lays Potato Chips x1'],
  },
];
// --- End Mock Data ---

// --- Helper Components ---

const getStatusInfo = (status: OrderStatus) => {
    switch(status) {
        case 'Pending':
            return { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/40', animate: false };
        case 'Preparing':
            return { icon: RefreshCw, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/40', animate: true };
        case 'Completed':
            return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/40', animate: false };
        case 'Cancelled':
            return { icon: XCircle, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/40', animate: false };
        default:
            return { icon: ClipboardList, color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700', animate: false };
    }
};


const OrderCard = ({ order }: { order: MockShopOrder }) => {
    const statusInfo = getStatusInfo(order.status);
    
    // Simple navigation handler (simulating Next.js router or window redirect)
    const navigateToDetails = () => {
        if (typeof window !== 'undefined' && (window as any).setMockPathname) {
            (window as any).setMockPathname(`/dashboard/orders/${order.id}`);
        } else {
             window.location.href = `/dashboard/orders/${order.id}`;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700 
                       cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-yellow-400 dark:hover:border-yellow-500"
            onClick={navigateToDetails}
        >
            <div className="flex items-center justify-between">
                {/* Left side: Status Badge, Name, ID */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Status Icon in a colored ring/circle */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusInfo.bgColor}`}>
                        <statusInfo.icon className={`w-4 h-4 ${statusInfo.color} ${statusInfo.animate ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-white truncate">{order.customerName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">ID: {order.id} | {order.timeAgo}</p>
                    </div>
                </div>

                {/* Right side: Total and Action */}
                <div className="text-right shrink-0 ml-4">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{order.total}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                        <p className={`text-xs font-semibold ${statusInfo.color}`}>{order.status}</p>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Items List (Less important info) */}
            <div className="pt-3 mt-3 border-t border-dashed border-gray-100 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    <span className="font-medium mr-1">Items:</span> {order.items.join(', ')}
                </p>
            </div>
        </motion.div>
    );
};
// --- End Helper Components ---


// --- Main Page Component ---
export default function ShopkeeperOrdersPage() {

  type Tab = 'Pending' | 'Preparing' | 'History'; 
  const [activeTab, setActiveTab] = useState<Tab>('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    let orders: MockShopOrder[];

    if (activeTab === 'Pending') {
      orders = allShopOrders.filter(o => o.status === 'Pending');
    } else if (activeTab === 'Preparing') {
      orders = allShopOrders.filter(o => o.status === 'Preparing');
    } else {
      // History tab shows both Completed and Cancelled
      orders = allShopOrders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');
    }

    if (searchTerm) {
        orders = orders.filter(o => 
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return orders;
  }, [activeTab, searchTerm]);
  
  const TABS: Tab[] = ['Pending', 'Preparing', 'History']; 

  return (
    <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management 📦</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Review and process touch-friendly order cards.</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID or Customer Name..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
            />
        </div>

        {/* Tab Navigation (Pill Selector) */}
        <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner">
            {TABS.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-1/3 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                        activeTab === tab 
                            ? 'text-gray-900 dark:text-gray-100' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                    } relative`}
                >
                    {activeTab === tab && (
                        <motion.div
                            layoutId="shop-order-pill"
                            className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-md"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">{tab}</span>
                </button>
            ))}
        </div>

        {/* Order List (Single Column for Mobile) */}
        <motion.div layout className="grid grid-cols-1 gap-4">
            <AnimatePresence>
                {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))
                ) : (
                <motion.div
                    key="no-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                >
                    <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
                        {searchTerm ? 'No Orders Found' : `No ${activeTab} Orders`}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {searchTerm ? 'Try a different search term.' : `New orders in this category will appear here.`}
                    </p>
                </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </motion.div>
  );
}