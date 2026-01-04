"use client";

import React from 'react';
import {
  ArrowLeft,
  Database,
  FileText,
  MapPin,
  Share2,
  Wallet,
  Shield,
  Boxes,
  Settings,
  RefreshCw,
  Headphones,
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Main Page Component ---
export default function PrivacyPolicyPage() {

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
      id: "information-collect",
      icon: Database,
      title: "Information we collect",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      points: [
        "We collect basic details like name, mobile number, address, and location (if allowed)."
      ]
    },
    {
      id: "use-of-information",
      icon: FileText,
      title: "Use of information",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      subtitle: "Your information is used to:",
      points: [
        "Create and manage your account",
        "Process orders and deliveries",
        "Improve app experience and support"
      ]
    },
    {
      id: "location-data",
      icon: MapPin,
      title: "Location data",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      points: [
        "Location helps show nearby shops and delivery availability.",
        "You can use the app without live location, but some features may not work properly."
      ]
    },
    {
      id: "sharing-information",
      icon: Share2,
      title: "Sharing of information",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      subtitle: "Your details are shared only with:",
      points: [
        "Shopkeepers (for order processing)",
        "Delivery partners (for delivery)",
        "We do not sell your personal data."
      ]
    },
    {
      id: "payments-cod",
      icon: Wallet,
      title: "Payments & COD",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      points: [
        "For Cash on Delivery, payment details are handled at delivery time.",
        "Eazika does not store card or UPI details."
      ]
    },
    {
      id: "data-security",
      icon: Shield,
      title: "Data security",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      points: [
        "We take reasonable steps to protect your data.",
        "However, no online platform is 100% secure."
      ]
    },
    {
      id: "third-party",
      icon: Boxes,
      title: "Third-party services",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      points: [
        "We may use third-party tools (maps, notifications, analytics) to run the app smoothly."
      ]
    },
    {
      id: "your-control",
      icon: Settings,
      title: "Your control",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      points: [
        "You can update or delete your account information anytime from the app."
      ]
    },
    {
      id: "policy-updates",
      icon: RefreshCw,
      title: "Policy updates",
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      points: [
        "This Privacy Policy may be updated from time to time.",
        "Continued use of the app means you accept the changes."
      ]
    },
    {
      id: "contact-us",
      icon: Headphones,
      title: "Contact us",
      color: "text-violet-500",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
      points: [
        "For any privacy concerns, contact Eazika support through the app."
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Privacy Policy</h1>
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
                  {section.subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3 font-medium">
                      {section.subtitle}
                    </p>
                  )}
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
              Your privacy is important to us. We are committed to protecting your personal information.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}