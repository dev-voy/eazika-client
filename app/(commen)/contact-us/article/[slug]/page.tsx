"use client";

import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, 
    Key,
    Mail,
    Package,
    RefreshCw,
    XCircle,
    Timer,      // --- ADDED ---
    MapPin      // --- ADDED ---
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock Article Content ---
// In a real app, you'd fetch this based on the slug
const articles = {
  // --- Account Articles ---
  'reset-password': {
    title: 'How do I reset my password?',
    icon: Key, 
    steps: [
      'From the Log In screen, tap on the "Forgot Password?" link.',
      'Enter the email address associated with your account and tap "Send Reset Link".',
      'Check your email inbox for a message from Eazika.',
      'Click the secure link in the email.',
      'Follow the on-screen instructions to create a new, secure password.',
    ],
    footerNote: 'If you do not see the email, please check your spam or junk folder.'
  },
  'update-email': {
    title: 'How do I update my email?',
    icon: Mail, 
    steps: [
        'Go to your Profile page.',
        'Tap on "Edit Profile".',
        'Update the email field and tap "Save Changes".',
        'You may be asked to verify your new email address.'
    ],
    footerNote: 'If you have trouble, please contact support.'
  },
  // --- Order Articles ---
  'missing-item': {
    title: 'Missing or incorrect items',
    icon: Package,
    steps: [
      'We are sorry for the inconvenience!',
      'Please go to your "Order History" and select the order.',
      'Tap on the "Get Help" button at the bottom of the order details.',
      'Select the "Missing or incorrect items" option and follow the prompts.',
    ],
    footerNote: 'Our support team will review your request and issue a refund if applicable.'
  },
  'refund-status': {
    title: 'Check refund status',
    icon: RefreshCw,
    steps: [
      'Refunds are typically processed within 5-7 business days.',
      'You can check your "Order History" for any orders that have been refunded.',
      'If you do not see your refund after 7 business days, please contact support.',
    ],
    footerNote: 'Refunds will be credited back to your original payment method.'
  },
  'cancel-order': {
    title: 'How to cancel an order',
    icon: XCircle,
    steps: [
      'If your order is still "Live", you can track it from the "Order History" page.',
      'On the "Track Order" screen, you will find a "Cancel Order" button.',
      'If the "Cancel Order" button is not visible, it means the restaurant has already started preparing your order and it can no longer be cancelled.',
    ],
    footerNote: 'Orders that are already out for delivery cannot be cancelled.'
  },
  // --- NEW DELIVERY ARTICLES ---
  'late-delivery': {
    title: 'My order is late',
    icon: Timer,
    steps: [
        'We apologize for the delay in your order.',
        'You can check the "Track Order" page for the latest ETA and see your driver\'s live location.',
        'Sometimes, high traffic or restaurant delays can affect the delivery time.',
        'If the order is significantly late, please use the "Get Help" button on the order details page.'
    ],
    footerNote: 'We are working hard to get your order to you as soon as possible.'
  },
  'wrong-address': {
    title: 'Delivered to wrong address',
    icon: MapPin,
    steps: [
        'Please double-check the delivery address listed on your order confirmation.',
        'If the driver delivered to a different address, please go to your "Order History".',
        'Select the affected order and tap "Get Help".',
        'Choose the "Delivered to wrong address" option to report the issue to our team.'
    ],
    footerNote: 'Our support team will investigate the issue immediately.'
  }
};
// --- END OF NEW ARTICLES ---

// We can define a more flexible type for the article
type Article = typeof articles[keyof typeof articles];

// --- Main Page Component ---
export default function SupportArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  // Get slug from URL on client side
  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const currentSlug = pathSegments[pathSegments.length - 1];
    setSlug(currentSlug);
    
    // Check if the slug exists in our articles object
    if (currentSlug in articles) {
      setArticle(articles[currentSlug as keyof typeof articles]);
    }
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!article) {
    // Loading or Not Found state
    return (
      <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
        <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          {/* Changed href to go back to the previous support page */}
          <a href="/support" aria-label="Go back to support">
            <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </a>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</h1>
        </header>
        <main className="p-4 md:p-6 text-center">
            <div className="animate-pulse max-w-lg mx-auto">
                <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mt-8"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mt-4"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mt-4"></div>
            </div>
        </main>
      </div>
    );
  }

  const Icon = article.icon;

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        {/* Changed href to go back to the previous support page */}
        <a href="/support" aria-label="Go back to support">
          <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">{article.title}</h1>
      </header>

      {/* Main Content */}
      <main className="grow overflow-y-auto p-4 md:p-6">
        <motion.div
          className="max-w-lg mx-auto"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {article.title}
                </h2>
            </div>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ol className="list-decimal list-inside space-y-3 mt-4">
                {article.steps.map((step, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-500 italic">
                {article.footerNote}
              </p>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}