"use client";

import React from 'react';
import {
  ArrowLeft,
  Store,
  User,
  MapPin,
  ShoppingBag,
  Wallet,
  Truck,
  RotateCcw,
  Package,
  Star,
  ShieldAlert,
  RefreshCw,
  Headphones,
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Main Page Component ---
export default function TermsOfServicePage() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const sections = [
    {
      id: "platform-role",
      icon: Store,
      title: "Platform role",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      points: [
        "Eazika is a platform that connects customers with nearby local shops.",
        "Eazika does not sell products directly."
      ]
    },
    {
      id: "account-details",
      icon: User,
      title: "Account & details",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      points: [
        "Customers must provide correct mobile number and address for order delivery.",
        "Wrong details may cause order cancellation."
      ]
    },
    {
      id: "location-permission",
      icon: MapPin,
      title: "Location permission",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      points: [
        "Location access helps show nearby shops and delivery availability.",
        "You may continue without live location, but service accuracy may reduce."
      ]
    },
    {
      id: "orders",
      icon: ShoppingBag,
      title: "Orders",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      points: [
        "Once an order is placed, it is sent to the selected shop.",
        "Order acceptance depends on shop availability."
      ]
    },
    {
      id: "pricing-payment",
      icon: Wallet,
      title: "Pricing & payment",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      points: [
        "Product prices are decided by the shop.",
        "Orders can be placed with Cash on Delivery (COD). Payment will be collected at the time of delivery."
      ]
    },
    {
      id: "delivery",
      icon: Truck,
      title: "Delivery",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      points: [
        "Delivery time is estimated and may vary due to traffic, weather, or shop delay.",
        "Eazika is not responsible for delays caused by shops or riders."
      ]
    },
    {
      id: "cancellation-refund",
      icon: RotateCcw,
      title: "Cancellation & refund",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      points: [
        "Cancellation and refund depend on shop policy.",
        "Once the order is prepared or dispatched, cancellation may not be possible."
      ]
    },
    {
      id: "product-quality",
      icon: Package,
      title: "Product quality",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      points: [
        "Product quality, freshness, and quantity are the responsibility of the shop.",
        "Any issue should be reported immediately through support."
      ]
    },
    {
      id: "ratings-reviews",
      icon: Star,
      title: "Ratings & reviews",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      points: [
        "Customers can give honest ratings and reviews based on their experience.",
        "Fake or abusive reviews may be removed."
      ]
    },
    {
      id: "misuse",
      icon: ShieldAlert,
      title: "Misuse of platform",
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      points: [
        "Fake orders, abuse, or fraud may lead to account suspension."
      ]
    },
    {
      id: "changes",
      icon: RefreshCw,
      title: "Changes to terms",
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      points: [
        "Eazika may update these terms anytime.",
        "Continued use means you accept the updated terms."
      ]
    },
    {
      id: "support",
      icon: Headphones,
      title: "Support",
      color: "text-violet-500",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
      points: [
        "For any issue, customers can contact Eazika support through the app."
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <header className="px-4 md:px-6 py-5 flex items-center space-x-4 border-b dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
        <a href="/profile" aria-label="Go back to profile" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Terms of Service</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last updated: January 4, 2026</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow overflow-y-auto p-4 md:p-8 pb-12">
        <motion.div
          className="max-w-4xl mx-auto space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group"
              >
                <div className={`${section.bgColor} px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3`}>
                  <div className={`${section.color} p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className={`text-xl font-bold ${section.color}`}>
                    {section.title}
                  </h2>
                </div>
                <div className="px-6 py-5">
                  <ul className="space-y-3">
                    {section.points.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
                        <span className={`${section.color} mt-1.5 flex-shrink-0`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}

          {/* Footer Note */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center pb-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              By using Eazika, you agree to these terms and conditions.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}