"use client";

import React, { useState, useEffect } from "react";
import { AdminService } from "@/services/adminService";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Store,
  AlertCircle,
  ArrowUpRight,
  Check,
  X,
  Download,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: "₹0",
    totalOrders: 0,
    totalUsers: 0,
    totalShops: 0,
    pendingShopApprovals: 0,
    activeOrders: 0,
    revenueTrend: [] as any[],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await AdminService.getStats();
        setStats({
          ...data,
          // Format currency if backend sends raw number
          totalSales:
            typeof data.totalSales === "number"
              ? `₹${data.totalSales}`
              : data.totalSales,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, here's what's happening today.
          </p>
        </div>
        {/* Export Button Code ... */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalSales}
              </h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* Orders */}
        <Link href="/admin/orders">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalOrders}
                </h3>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <ShoppingBag size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Users */}
        <Link href="/admin/users">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalUsers}
                </h3>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                <Users size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Shops Pending */}
        <Link href="/admin/shops">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Shop Approvals
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.pendingShopApprovals}
                </h3>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                <AlertCircle size={20} />
              </div>
            </div>
            {stats.pendingShopApprovals > 0 && (
              <div className="mt-4 text-xs text-orange-600 font-medium">
                Requires Action
              </div>
            )}
          </div>
        </Link>
      </div>
      {/* ... Rest of your charts and recent activity code ... */}
    </div>
  );
}
