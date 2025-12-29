"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ListOrdered, User, Heart } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Categories", href: "/categories", icon: ListOrdered },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Profile", href: "/profile", icon: User },
];

export function CustomerBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 md:hidden shadow-2xl">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = (pathname || "").startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center p-1 transition-colors duration-200",
                isActive
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-yellow-500"
              )}
              aria-label={item.name}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}