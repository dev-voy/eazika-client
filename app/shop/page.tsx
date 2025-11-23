"use client";

import React from 'react';
import { 
    TrendingUp, 
    Package, 
    ShoppingBag, 
    Users, 
    ArrowUpRight,
    Clock,
    Share2,
    Copy,
    Store
} from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA TOGGLE ---
// Change to 'false' to see populated data, 'true' to see empty state
const IS_NEW_SHOP = true; 

const emptyStats = [
    { title: 'Total Sales', value: '₹0', change: '0%', icon: TrendingUp, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
    { title: 'Active Orders', value: '0', change: 'No active', icon: ShoppingBag, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
    { title: 'Products', value: '0', change: 'Add First', icon: Package, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { title: 'Customers', value: '0', change: '0', icon: Users, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
];

const populatedStats = [
    { title: 'Total Sales', value: '₹12,450', change: '+12%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Active Orders', value: '8', change: 'Processing', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Products', value: '45', change: '5 Low Stock', icon: Package, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { title: 'Customers', value: '1,204', change: '+4 New', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
];

const populatedOrders = [
    { id: '#ORD-001', customer: 'Rahul Kumar', items: '2x Milk, 1x Bread', total: '₹145', status: 'Pending', time: '2 mins ago' },
    { id: '#ORD-002', customer: 'Priya Singh', items: '5kg Rice', total: '₹450', status: 'Preparing', time: '15 mins ago' },
    { id: '#ORD-003', customer: 'Amit Sharma', items: '1x Shampoo', total: '₹180', status: 'Ready', time: '1 hour ago' },
];

const activeStats = IS_NEW_SHOP ? emptyStats : populatedStats;
const recentOrders = IS_NEW_SHOP ? [] : populatedOrders;

export default function ShopDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {IS_NEW_SHOP ? "Welcome to Eazika! Let's get your shop running." : "Welcome back! Here's what's happening today."}
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* Share Shop Button (Visible if new shop) */}
                    {IS_NEW_SHOP && (
                         <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
                            <Share2 size={18} /> Share Link
                        </button>
                    )}
                    <Link href="/shop/products/new">
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-yellow-500/20 transition-colors flex items-center gap-2 text-sm">
                            <Package size={18} /> Add Product
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {activeStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                {stat.change && (
                                    <span className={`text-[10px] font-bold flex items-center px-2 py-1 rounded-full ${
                                        IS_NEW_SHOP ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                    }`}>
                                        {stat.change} {IS_NEW_SHOP ? '' : <ArrowUpRight size={10} className="ml-0.5" />}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[300px]">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white">Recent Orders</h2>
                    {recentOrders.length > 0 && (
                        <Link href="/shop/orders" className="text-sm text-yellow-600 font-medium hover:underline">View All</Link>
                    )}
                </div>
                
                <div className="flex-1 flex flex-col">
                    {recentOrders.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {recentOrders.map((order, i) => (
                                <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs font-bold">
                                            {order.customer.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{order.customer}</h4>
                                                <span className="text-xs text-gray-400">• {order.id}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{order.items}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={12} /> {order.time}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{order.total}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* --- EMPTY STATE UI --- */
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4 relative">
                                <Store className="text-gray-300 dark:text-gray-600 w-10 h-10" />
                                <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-1.5 border-4 border-white dark:border-gray-800">
                                    <Share2 size={12} className="text-white" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No orders yet</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                                Your shop is ready! Share your shop link with customers to start receiving orders.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                                <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 text-left">
                                        eazika.com/shop/fresh-mart
                                    </span>
                                    <button className="ml-2 text-yellow-600 dark:text-yellow-500 font-bold text-xs hover:underline flex items-center gap-1">
                                        <Copy size={12} /> Copy
                                    </button>
                                </div>
                                <button className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-600 transition-colors whitespace-nowrap">
                                    Share Now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}