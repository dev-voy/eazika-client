"use client";

import React from 'react';
import { 
    ArrowLeft, 
    ChevronRight, 
    User, 
    Package, 
    MapPin, 
    MessageSquare,
    Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast'; // Import toast

// --- Mock Support Topics ---
const supportTopics = [
  { 
    id: 'account', 
    title: 'Account & Billing', 
    description: 'Manage your account, payments, and billing issues.',
    icon: User,
    href: '/support/account' // Placeholder link
  },
  { 
    id: 'orders', 
    title: 'Order Issues', 
    description: 'Help with missing items, refunds, and cancellations.',
    icon: Package,
    href: '/support/orders'
  },
  { 
    id: 'delivery', 
    title: 'Delivery & Address', 
    description: 'Track your order or manage delivery addresses.',
    icon: MapPin,
    href: '/support/delivery'
  },
  { 
    id: 'feedback', 
    title: 'App Feedback & Suggestions', 
    description: 'Report a bug or share your ideas with us.',
    icon: MessageSquare,
    href: '/support/feedback'
  },
];

// --- Main Page Component ---
export default function SupportPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const handleCall = () => {
    const dummyPhone = "+18001234567";
    // Use document.execCommand for clipboard as it's more reliable in iframes
    const textArea = document.createElement('textarea');
    textArea.value = dummyPhone;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('Support phone number copied!');
    } catch (err) {
      toast.error('Failed to copy phone number.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="bottom-center" />
      {/* Header */}
      <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <a href="/profile" aria-label="Go back to profile">
          <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Support & FAQ</h1>
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Common Topics
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <ul className="divide-y dark:divide-gray-700">
              {supportTopics.map((topic) => (
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

          {/* Contact Us Section */}
          <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Need more help?
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <button 
                onClick={handleCall}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">Call Us</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Speak to our support team 24/7</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}