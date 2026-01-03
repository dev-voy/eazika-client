"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    CheckCircle,
    Star,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    Calendar,
    Clock,
    Loader2,
    Eye,
    FileText,
    ShoppingBag,
    Store,
    Ban,
    BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminService } from '@/services/adminService';

export default function AdminShopDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const shopId = params?.id;

    const [shop, setShop] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        if (shopId) {
            fetchShopDetails();
        }
    }, [shopId]);

    const fetchShopDetails = async () => {
        try {
            setLoading(true);
            // Fetch shop details and orders
            const allShops = await AdminService.getAllShops?.();
            const shopData = allShops?.find((s: any) => s.id == shopId);
            if (shopData) {
                setShop(shopData);
            }

            // Fetch shop orders
            const allOrders = await AdminService.getAllOrders?.();
            const shopOrders = allOrders?.filter((o: any) => o.shopId == shopId) || [];
            setOrders(shopOrders);
        } catch (error) {
            console.error("Failed to fetch shop details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Not Found</h1>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const activeOrders = orders.filter(o => ['pending', 'shipped'].includes(o.status));
    const totalEarnings = shop.totalEarning || 0;
    const avgOrderValue = (shop.totalOrders && shop.totalOrders > 0) ? Math.round(totalEarnings / shop.totalOrders) : 0;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        {shop.shopName || 'Shop Details'}
                        {shop.status === 'active' && <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm px-3 py-1 rounded-full">Active</span>}
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <MapPin size={14} /> {shop.location || 'Location not set'}
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 p-6 rounded-2xl border border-green-200 dark:border-green-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm text-gray-700 dark:text-gray-300 uppercase font-bold">Total Earnings</h3>
                        <DollarSign className="text-green-600 dark:text-green-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">↑ 12% from last month</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 p-6 rounded-2xl border border-blue-200 dark:border-blue-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm text-gray-700 dark:text-gray-300 uppercase font-bold">Total Orders</h3>
                        <Package className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{shop.totalOrders || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">↑ 8% from last month</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 p-6 rounded-2xl border border-orange-200 dark:border-orange-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm text-gray-700 dark:text-gray-300 uppercase font-bold">Active Orders</h3>
                        <TrendingUp className="text-orange-600 dark:text-orange-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeOrders.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Being prepared/shipped</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/40 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm text-gray-700 dark:text-gray-300 uppercase font-bold">Avg Rating</h3>
                        <Star className="text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{(shop.averageRating || 4.5).toFixed(1)}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Based on {shop.totalCustomers || 0} customers</p>
                </motion.div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm text-gray-500 uppercase font-bold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500">Owner Name</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{shop.user?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Phone size={14} className="text-blue-500" /> {shop.user?.phone || shop.phone || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{shop.user?.email || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm text-gray-500 uppercase font-bold mb-4">Performance</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500">Total Customers</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users size={14} className="text-purple-500" /> {shop.totalCustomers || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Avg Order Value</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">₹{avgOrderValue.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className={`text-sm font-bold px-3 py-1 rounded w-fit capitalize ${shop.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                {shop.status}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm text-gray-500 uppercase font-bold mb-4">Timeline</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500">Registered</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar size={14} className="text-blue-500" /> {shop.createdAt ? new Date(shop.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Last Updated</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock size={14} className="text-gray-500" /> {shop.updatedAt ? new Date(shop.updatedAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings Graph Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="text-blue-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Earnings Overview (Weekly)</h2>
                </div>
                <div className="h-64 flex items-end justify-around gap-3 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    {[
                        { day: 'Mon', value: 45, label: '₹5.2K' },
                        { day: 'Tue', value: 52, label: '₹6.1K' },
                        { day: 'Wed', value: 42, label: '₹4.9K' },
                        { day: 'Thu', value: 62, label: '₹7.2K' },
                        { day: 'Fri', value: 58, label: '₹6.8K' },
                        { day: 'Sat', value: 70, label: '₹8.1K' },
                        { day: 'Sun', value: 65, label: '₹7.5K' }
                    ].map((item) => (
                        <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                            <div
                                className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-700"
                                style={{ height: `${item.value * 3}px` }}
                            />
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-900 dark:text-white">{item.day}</p>
                                <p className="text-xs text-gray-500">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Active Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Package size={24} className="text-blue-500" />
                    Current Active Orders ({activeOrders.length})
                </h2>

                {activeOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 uppercase text-xs font-bold">
                                <tr>
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Ordered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {activeOrders.slice(0, 8).map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{order.id}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.customer || 'Customer'}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.items || '2-3 items'}</td>
                                        <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{order.amount || '₹0'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{new Date().toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Package size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No active orders at the moment</p>
                    </div>
                )}
            </div>
        </div>
    );
}