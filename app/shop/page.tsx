"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
    DollarSign, 
    ClipboardList, 
    Package, 
    Users, 
    ExternalLink,
    ArrowUp,
    RefreshCw,
    AlertCircle,
    Truck,
    CheckCircle // Added CheckCircle import
} from 'lucide-react';

// --- Mock Data ---
const stats = [
    { 
        id: 1, 
        title: "Today's Revenue", 
        value: "$1,200", 
        change: "+15%", 
        changeType: 'positive',
        icon: DollarSign,
        size: 'large' 
    },
    { 
        id: 2, 
        title: "Pending Orders", 
        value: "25", 
        change: "Needs attention", 
        changeType: 'alert',
        icon: ClipboardList,
        size: 'large'
    },
    { 
        id: 3, 
        title: "Total Products", 
        value: "450", 
        change: "In Stock", 
        changeType: 'neutral',
        icon: Package,
        size: 'small'
    },
    { 
        id: 4, 
        title: "New Customers", 
        value: "32", 
        change: "vs Yesterday", 
        changeType: 'positive',
        icon: Users,
        size: 'small'
    },
];

const recentOrders = [
    { 
        id: 'EAZ123', 
        customer: 'Ratul Islam', 
        total: '$45.00', 
        status: 'Pending', 
        icon: Truck,
        statusColor: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
        id: 'EAZ122', 
        customer: 'Jane Doe', 
        total: '$120.00', 
        status: 'Preparing', 
        icon: RefreshCw,
        statusColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
        id: 'EAZ121', 
        customer: 'John Smith', 
        total: '$22.50', 
        status: 'Delivered', 
        icon: CheckCircle,
        statusColor: 'text-green-600 dark:text-green-400'
    },
];
// --- End Mock Data ---


// --- Stats Card Component (Slimmer) ---
const StatsCard = ({ item }: { item: typeof stats[0] }) => {
    
    const getChangeVisuals = () => {
        switch (item.changeType) {
            case 'positive':
                return { icon: ArrowUp, color: 'text-green-500' };
            case 'alert':
                return { icon: AlertCircle, color: 'text-red-500' };
            case 'neutral':
            default:
                return { icon: RefreshCw, color: 'text-gray-500' };
        }
    };
    
    const { icon: ChangeIcon, color: changeColor } = getChangeVisuals();
    const isLarge = item.size === 'large';
    const paddingClass = isLarge ? 'p-5' : 'p-4';
    const textValueClass = isLarge ? 'text-3xl' : 'text-xl';
    const iconSizeClass = isLarge ? 'w-8 h-8' : 'w-5 h-5';

    return (
        <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className={`bg-white dark:bg-gray-800 ${paddingClass} rounded-xl shadow-sm border border-gray-100 dark:border-gray-700`}
        >
            <div className="flex items-center justify-between">
                <item.icon className={`${iconSizeClass} text-yellow-500`} />
                
                <p className={`${textValueClass} font-bold text-gray-900 dark:text-white`}>
                    {item.value}
                </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className={`text-sm font-medium ${isLarge ? 'text-gray-700' : 'text-gray-500'} dark:text-gray-400`}>
                    {item.title}
                </span>
                <p className={`text-xs flex items-center gap-1 ${changeColor}`}>
                    <ChangeIcon className="h-3 w-3" />
                    {item.change}
                </p>
            </div>
        </motion.div>
    );
};

// --- Actionable Recent Order List Item ---
const RecentOrderListItem = ({ order }: { order: typeof recentOrders[0] }) => (
    <motion.a
        href={`/dashboard/orders/${order.id}`}
        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
        className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
    >
        {/* Left: ID & Customer */}
        <div className="flex items-center gap-3">
            <order.icon className={`w-5 h-5 ${order.statusColor}`} />
            <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{order.customer}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.id}</p>
            </div>
        </div>

        {/* Right: Total & Status */}
        <div className="text-right">
            <p className="text-base font-bold text-gray-900 dark:text-white">{order.total}</p>
            <p className={`text-xs font-medium ${order.statusColor}`}>{order.status}</p>
        </div>
    </motion.a>
);


// --- Main Mobile Dashboard Page ---
export default function ShopkeeperDashboardPage() {
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 1. Header & Greeting */}
            <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="pt-2"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back! 👋</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-0.5">Quick summary of your shop's performance.</p>
            </motion.div>

            {/* 2. Top Stats (Mobile Grid) */}
            <motion.div 
                variants={containerVariants}
                // Single column on xs/sm, but uses a grid for 2x2 layout
                className="grid grid-cols-2 gap-4"
            >
                {stats.map(item => (
                    <StatsCard key={item.id} item={item} />
                ))}
            </motion.div>

            {/* 3. Recent Orders List */}
            <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Orders (3)</h2>
                    <a 
                        href="/dashboard/orders" 
                        className="flex items-center gap-1 text-sm font-semibold text-yellow-500 hover:text-yellow-600"
                    >
                        View All <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                
                {/* Order List */}
                <motion.div variants={containerVariants}>
                    {recentOrders.map(order => (
                        <RecentOrderListItem key={order.id} order={order} />
                    ))}
                </motion.div>
            </motion.div>
            
            {/* 4. Action Card (Simple chart/Next Payout) */}
            <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3"
            >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Next Payout Window</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$820.00</p>
                <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Your total revenue graph for the last 7 days.</p>
            </motion.div>

        </motion.div>
    );
}