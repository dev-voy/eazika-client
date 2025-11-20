"use client";

import React from "react";
import Link from "next/link";
import { Search, MapPin, ShoppingBag, User } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher"; // Assuming ThemeSwitcher exists

export function CustomerHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Location & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="text-yellow-500 w-5 h-5" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              Delivering to: **Mumbai, 400078**
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeSwitcher />
            <Link 
              href="/profile" 
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="User Profile"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Bottom Row: Search */}
        <div className="mt-3">
          <Link href="/search" className="flex w-full items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-sm text-gray-500 dark:text-gray-400 border border-transparent hover:border-yellow-400 transition-all shadow-inner">
            <Search className="w-5 h-5 mr-3 text-yellow-500" />
            <span className="font-medium">Search for groceries, snacks, etc.</span>
          </Link>
        </div>
      </div>
    </header>
  );
}