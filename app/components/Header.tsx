"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Search, X } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products as allProducts } from "@/app/data/mockData";
import Image from "next/image";
import { useCartStore } from "@/app/hooks/useCartStore"; // IMPORT STORE

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Connect to Cart Store
  const { cartCount } = useCartStore(); 

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof allProducts>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search Logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchSuggestions([]);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const matches = allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.category.toLowerCase().includes(lowerQuery)
    );
    setSearchSuggestions(matches.slice(0, 5));
  }, [searchQuery]);

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Categories", href: "/categories" },
    { name: "Deals", href: "/trending" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md border-b border-gray-200/50 dark:border-gray-800/50"
          : "bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-100/50 dark:border-gray-800/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
        
        {/* --- LEFT SECTION: Theme Switcher & Logo --- */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="scale-90 md:scale-100">
            <ThemeSwitcher />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex items-center">
            <Link href="/home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform">
                E
              </div>
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Eazika
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-yellow-500 ${
                  pathname === link.href
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- CENTER SECTION: Search Bar (Desktop Only) --- */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="relative w-full group z-50">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} 
              placeholder="Search for products..."
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2.5 pl-10 pr-10 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500/50 transition-all group-hover:bg-gray-50 dark:group-hover:bg-gray-700"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-yellow-500 transition-colors" size={18} />
            
            {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
            )}
          </div>

          <AnimatePresence>
              {isSearchFocused && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-96 overflow-y-auto z-60"
                >
                  {searchSuggestions.length > 0 ? (
                    <ul>
                      {searchSuggestions.map((product) => (
                        <li key={product.id}>
                          <Link 
                            href={`/products/${product.id}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                              <Image src={product.images[0]} alt={product.name} layout="fill" objectFit="cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                            </div>
                            <div className="text-sm font-bold text-yellow-600 dark:text-yellow-500">
                              ₹{product.price}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {/* --- RIGHT SECTION: Actions --- */}
        <div className="flex items-center gap-2 md:gap-3">
            <Link 
                href="/wishlist" 
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all hover:scale-105 hover:text-red-500 dark:hover:text-red-500"
            >
                <Heart size={22} strokeWidth={2} />
            </Link>

            <Link 
                href="/cart" 
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all hover:scale-105 relative group"
            >
                <ShoppingCart size={22} strokeWidth={2} className="group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors"/>
                {/* Updated Dynamic Count */}
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 shadow-sm">
                      {cartCount}
                  </span>
                )}
            </Link>

            <Link 
                href="/profile" 
                className="hidden md:flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
                <div className="w-8 h-8 bg-linear-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    R
                </div>
            </Link>
        </div>
      </div>
    </header>
  );
}