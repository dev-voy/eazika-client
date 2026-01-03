"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminService } from "@/services/adminService";
import {
  Search,
  Star,
  Users,
  TrendingUp,
  Phone,
  MapPin,
  Package,
  DollarSign,
  Eye,
  Loader2,
  ShoppingBag,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminShopsPage() {
  const router = useRouter();
  const [shops, setShops] = useState<any[]>([]);
  const [filteredShops, setFilteredShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("earnings");
  const [statusFilter, setStatusFilter] = useState("active");

  useEffect(() => {
    fetchShops();
  }, [statusFilter]);

  useEffect(() => {
    filterAndSortShops();
  }, [search, sortBy, shops]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllShops(
        statusFilter === "all" ? undefined : statusFilter
      );
      setShops(data || []);
    } catch (error) {
      console.error("Failed to fetch shops", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortShops = () => {
    let filtered = shops.filter(
      (shop) =>
        (shop.shopName || "").toLowerCase().includes(search.toLowerCase()) ||
        (shop.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (shop.location || "").toLowerCase().includes(search.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "earnings") {
        return (b.totalEarning || 0) - (a.totalEarning || 0);
      } else if (sortBy === "orders") {
        return (b.totalOrders || 0) - (a.totalOrders || 0);
      } else if (sortBy === "rating") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      return 0;
    });

    setFilteredShops(filtered);
  };

  const stats = [
    {
      title: "Total Shops",
      value: shops.length,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Earnings",
      value: `₹${shops.reduce((acc, s) => acc + (s.totalEarning || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Orders",
      value: shops.reduce((acc, s) => acc + (s.totalOrders || 0), 0),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Active Orders",
      value: shops.reduce((acc, s) => acc + (s.activeOrders || 0), 0),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Approved Shops
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor all your approved shops
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}
              >
                <Icon size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {stat.title}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filter & Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by shop name, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer dark:text-white"
        >
          <option value="active">Active Shops</option>
          <option value="pending">Pending Approval</option>
          <option value="all">All Shops</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer dark:text-white"
        >
          <option value="earnings">Sort by Earnings</option>
          <option value="orders">Sort by Orders</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Shops Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredShops.map((shop, idx) => (
              <motion.div
                key={shop.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => router.push(`/admin/shops/${shop.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all group relative overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -z-0" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {shop.shopName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {shop.location || "Location not set"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 rounded-lg">
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                        {shop.averageRating || "4.5"}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                      Contact
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Phone size={14} className="text-blue-500" />{" "}
                      {shop.user?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold">
                        Earnings
                      </p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        ₹{(shop.totalEarning || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">
                        Orders
                      </p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {shop.totalOrders || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs text-purple-600 dark:text-purple-400 uppercase font-bold">
                        Customers
                      </p>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        {shop.totalCustomers || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold">
                        Active
                      </p>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {shop.activeOrders || 0}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:from-blue-600 group-hover:to-purple-700">
                    <Eye size={16} /> View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No Shops Found
          </h3>
          <p className="text-sm text-gray-500">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
}
