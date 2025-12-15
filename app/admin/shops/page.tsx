"use client";

import React, { useState, useEffect } from "react";
import { AdminService } from "@/services/adminService";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Store,
  Eye,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function AdminShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchShops = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllShops(
        statusFilter === "all" ? undefined : statusFilter
      );
      setShops(data);
    } catch (error) {
      console.error("Failed to fetch shops", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [statusFilter]);

  const handleAction = async (
    shopId: number,
    status: "active" | "rejected"
  ) => {
    if (!confirm(`Are you sure you want to mark this shop as ${status}?`))
      return;
    try {
      await AdminService.verifyShop(shopId, status);
      fetchShops(); // Refresh list
    } catch (error) {
      alert("Failed to update shop status");
    }
  };

  const filteredShops = shops.filter(
    (s) =>
      s.shopName.toLowerCase().includes(search.toLowerCase()) ||
      s.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const pendingShops = filteredShops.filter((s) => s.status === "pending");
  const activeShops = filteredShops.filter((s) => s.status !== "pending");

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Shops
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search shops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg flex-1 dark:bg-gray-800 dark:border-gray-700"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* PENDING SHOPS TABLE */}
      {statusFilter !== "active" && pendingShops.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
            New Shop Requests
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-200 dark:border-orange-900/30 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-orange-50 dark:bg-orange-900/10 text-orange-800 dark:text-orange-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Shop Name</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingShops.map((shop) => (
                  <tr key={shop.id}>
                    <td className="px-6 py-4 font-bold">{shop.shopName}</td>
                    <td className="px-6 py-4">{shop.user.name}</td>
                    <td className="px-6 py-4">{shop.shopCategory}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(shop.id, "active")}
                        className="px-3 py-1 bg-green-500 text-white rounded text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(shop.id, "rejected")}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-bold"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACTIVE/OTHER SHOPS TABLE */}
      {statusFilter !== "pending" && activeShops.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            All Shops
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Shop Name</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {activeShops.map((shop) => (
                  <tr key={shop.id}>
                    <td className="px-6 py-4 font-bold">{shop.shopName}</td>
                    <td className="px-6 py-4">{shop.user.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                              shop.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {shop.status}
                          </span>
                          
                          <button
                            onClick={async () => {
                                const newStatus = shop.status !== 'active';
                                if(confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this shop?`)) {
                                    try {
                                        await AdminService.toggleShopStatus(shop.id, newStatus);
                                        fetchShops();
                                    } catch(e) {
                                        alert("Failed to update status");
                                    }
                                }
                            }}
                            className={`px-3 py-1 rounded text-xs font-semibold text-white transition-colors ${
                                shop.status === 'active' 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {shop.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
