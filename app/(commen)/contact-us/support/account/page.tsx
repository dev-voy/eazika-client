"use client";

import React from 'react';
import { 
    ArrowLeft, 
    ChevronRight,
    Key,
    Mail,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock FAQs for Account & Billing ---
const accountFaqs = [
  { 
    id: 'reset-password', 
    title: 'How do I reset my password?', 
    description: 'Learn how to reset your password from the login screen.',
    icon: Key,
    href: '/support/article/reset-password' // Placeholder link
  },
  { 
    id: 'update-email', 
    title: 'How do I update my email address?', 
    description: 'Change the email address associated with your account.',
    icon: Mail,
    href: '/support/article/update-email'
  },
  { 
    id: 'manage-payment', 
    title: 'Manage your payment methods', 
    description: 'Add, remove, or update your saved cards and UPI IDs.',
    icon: CreditCard,
    href: '/profile/payment' // Links directly to the payment page
  },
];

// --- Main Page Component ---
export default function AccountSupportPage() {
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Account & Billing</h1>
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
              {accountFaqs.map((topic) => (
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