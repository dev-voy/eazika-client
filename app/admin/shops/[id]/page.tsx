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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminShopDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const shopId = params?.id;

    const [shop, setShop] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [trend, setTrend] = useState<any[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [riders, setRiders] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'riders' | 'customers'>('orders');

    const deriveShop = (payload: any) => {
        if (!payload) return {} as any;
        const base = payload.shop || payload;
        const metrics = base.metrics || payload.metrics || {};
        return {
            id: base.id,
            shopName: base.shopName || base.name || "Shop Details",
            location: base.location || base.address || "Location not set",
            status: base.status || (base.isActive ? "active" : "inactive"),
            isActive: base.isActive,
            user: base.user || base.contact || {},
            riders: base.riders,
            phone: base.user?.phone || base.contact?.phone || base.phone,
            email: base.user?.email || base.contact?.email || base.email,
            averageRating: base.averageRating || base.rating || 0,
            totalCustomers: base.totalCustomers || metrics.totalCustomers || 0,
            totalOrders: base.totalOrders ?? metrics.totalOrders ?? 0,
            totalEarning: base.totalEarning ?? metrics.totalEarnings ?? 0,
            activeOrders: base.activeOrders ?? metrics.totalActiveOrders ?? 0,
            createdAt: base.createdAt,
            updatedAt: base.updatedAt,
        };
    };

    useEffect(() => {
        if (shopId) {
            fetchShopDetails();
        }
    }, [shopId]);

    const fetchShopDetails = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getShopAnalytics(Number(shopId));
            // console.log("Fetched shop analytics:", data);
            // Expected shape: { shop, metrics, orders, trend }
            if (data?.shop || data) {
                const normalizedShop = deriveShop(data);
                setShop(normalizedShop);
            }
            if (data?.orders) setOrders(Array.isArray(data.orders) ? data.orders : []);
            if (data?.trend) setTrend(Array.isArray(data.trend) ? data.trend : []);
            if (data?.riders) setRiders(Array.isArray(data.riders) ? data.riders : []);
            if (data?.customers) setCustomers(Array.isArray(data.customers) ? data.customers : []);
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

    const inRange = (dateStr?: string) => {
        if (!dateStr) return true;
        const ts = new Date(dateStr).getTime();
        const afterStart = startDate ? ts >= new Date(startDate).getTime() : true;
        const beforeEnd = endDate ? ts <= new Date(endDate).getTime() : true;
        return afterStart && beforeEnd;
    };

    const filteredOrders = orders.filter(o => inRange(o.createdAt));
    const activeOrders = filteredOrders.filter(o => ['pending', 'shipped'].includes(o.status));
    const derivedTrend = trend.filter(t => inRange(t.date));

    const totalEarnings = shop.totalEarning || 0;
    const totalOrders = shop.totalOrders || 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalEarnings / totalOrders) : 0;
    const totalActiveOrders = shop.activeOrders || 0;

    return (
        <div className="space-y-6 pb-12">
            {/* Header + Date Filter */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalActiveOrders}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Being prepared/shipped</p>
                </motion.div>

                {/* <motion.div
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
                </motion.div> */}
            </div>

            {/* Information Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div> */}

            {/* Earnings Graph - Line Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="text-green-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Earnings Trend</h2>
                </div>
                {derivedTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={derivedTrend.map((item) => ({
                            date: item.date,
                            earnings: item.earnings || item.totalEarnings || 0
                        }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#111827',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: '#e5e7eb'
                                }}
                                formatter={(value) => `₹${(value as number).toLocaleString()}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="earnings"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ fill: '#10b981', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-12 text-gray-500">No earnings data in selected range</div>
                )}
            </div>

            {/* Orders Graph - Line Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Package className="text-blue-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Orders Trend</h2>
                </div>
                {derivedTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={derivedTrend.map((item) => ({
                            date: item.date,
                            orders: item.orders || item.totalOrders || 0
                        }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#111827',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: '#e5e7eb'
                                }}
                                formatter={(value) => `${value} ${(value as number) === 1 ? 'Order' : 'Orders'}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-12 text-gray-500">No orders data in selected range</div>
                )}
            </div>

            {/* Tabbed Data View */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                {/* Tab Headers */}
                <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 px-4 font-bold text-sm transition-all relative ${activeTab === 'orders'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Package size={18} />
                            All Orders ({filteredOrders.length})
                        </div>
                        {activeTab === 'orders' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('riders')}
                        className={`pb-3 px-4 font-bold text-sm transition-all relative ${activeTab === 'riders'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            Riders ({riders.length})
                        </div>
                        {activeTab === 'riders' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`pb-3 px-4 font-bold text-sm transition-all relative ${activeTab === 'customers'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            Customers ({customers.length})
                        </div>
                        {activeTab === 'customers' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Orders</h2>
                        {filteredOrders.length > 0 ? (
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
                                        {filteredOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{order.id}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.customer || 'Customer'}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.items || '—'}</td>
                                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">₹{order.totalAmount || order.amount || 0}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Package size={48} className="mx-auto mb-4 opacity-30" />
                                <p>No orders found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Riders Tab */}
                {activeTab === 'riders' && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Riders</h2>
                        {riders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 uppercase text-xs font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Rider ID</th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Phone</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Total Deliveries</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {riders.map(rider => (
                                            <tr key={rider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">#{rider.id}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rider.name || 'N/A'}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-blue-500" />
                                                        {rider.phone || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rider.email || 'N/A'}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold">
                                                        {rider.totalDeliveries || 0} deliveries
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Users size={48} className="mx-auto mb-4 opacity-30" />
                                <p>No riders found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Customers Tab */}
                {activeTab === 'customers' && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Customers</h2>
                        {customers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 uppercase text-xs font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Customer ID</th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Phone</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {customers.map(customer => (
                                            <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">#{customer.id}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{customer.name || 'N/A'}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-blue-500" />
                                                        {customer.phone || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{customer.email || 'N/A'}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-green-500" />
                                                        {customer.joinedAt ? new Date(customer.joinedAt).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Users size={48} className="mx-auto mb-4 opacity-30" />
                                <p>No customers found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}