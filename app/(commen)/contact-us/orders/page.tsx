"use client";

import React from 'react';
import { 
    ArrowLeft, 
    ChevronRight,
    Package,
    RefreshCw,
    XCircle,
    HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock FAQs for Order Issues ---
const orderFaqs = [
  { 
    id: 'missing-item', 
    title: 'Missing or incorrect items', 
    description: 'What to do if your order is not as expected.',
    icon: Package,
    href: '/support/article/missing-item' // Placeholder link
  },
  { 
    id: 'refund-status', 
    title: 'Check refund status', 
    description: 'Track the progress of your refund.',
    icon: RefreshCw,
    href: '/support/article/refund-status'
  },
  { 
    id: 'cancel-order', 
    title: 'How to cancel an order', 
    description: 'Learn if you can cancel an order that is in progress.',
    icon: XCircle,
    href: '/support/article/cancel-order'
  },
  {
    id: 'contact-support',
    title: 'Still need help?',
    description: 'Chat with our support team for any issue.',
    icon: HelpCircle,
    href: '/chat/support' // Placeholder link to a support chat
  }
];

// --- Main Page Component ---
export default function OrderSupportPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <a href="/support" aria-label="Go back to support">
          <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Issues</h1>
      </header>

      {/* Main Content */}
      <main className="grow overflow-y-auto p-4 md:p-6">
        <motion.div
          className="max-w-lg mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Support Topics List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <ul className="divide-y dark:divide-gray-700">
              {orderFaqs.map((topic) => (
                <motion.li key={topic.id} variants={itemVariants}>
                  <a 
                    href={topic.href} 
                    className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <topic.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 dark:text-white">{topic.title}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{topic.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

        </motion.div>
      </main>
    </div>
  );
}