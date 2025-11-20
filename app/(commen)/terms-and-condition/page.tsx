"use client";

import React from 'react';
import { 
    ArrowLeft, 
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Main Page Component ---
export default function TermsOfServicePage() {

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <a href="/profile" aria-label="Go back to profile">
          <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Terms of Service</h1>
      </header>

      {/* Main Content */}
      <main className="grow overflow-y-auto p-4 md:p-6">
        <motion.div
          className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 dark:border-gray-700"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: November 10, 2025</p>

            <h2 id="introduction">1. Introduction</h2>
            <p>
              Welcome to Eazika ("Company", "we", "our", "us")! These Terms of Service ("Terms")
              govern your use of our website and mobile application (collectively, "Service")
              operated by Eazika. Please read these Terms carefully before using our Service.
            </p>

            <h2 id="accounts">2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide us with information that is
              accurate, complete, and current at all times. Failure to do so constitutes a
              breach of the Terms, which may result in immediate termination of your account
              on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the
              Service and for any activities or actions under your password, whether your
              password is with our Service or a third-party service.
            </p>

            <h2 id="prohibited">3. Prohibited Activities</h2>
            <p>
              You may not use the Service for any illegal or unauthorized purpose. You agree
              to comply with all local, state, national, and international laws and regulations.
              You are solely responsible for your conduct and any data, text, information,
              usernames, graphics, photos, profiles, audio and video clips, links ("Content")
              that you submit, post, and display on the Service.
            </p>

            <h2 id="liability">4. Limitation of Liability</h2>
            <p>
              In no event shall Eazika, nor its directors, employees, partners, agents,
              suppliers, or affiliates, be liable for any indirect, incidental, special,
              consequential or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from your access to
              or use of or inability to access or use the Service.
            </p>

            <h2 id="governing-law">5. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of
              our jurisdiction, without regard to its conflict of law provisions.
            </p>

            <h2 id="changes">6. Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms
              at any time. If a revision is material we will provide at least 30 days' notice
              prior to any new terms taking effect. What constitutes a material change will
              be determined at our sole discretion.
            </p>

            <h2 id="contact">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <a href="mailto:support@eazika.com" className="text-yellow-500 hover:text-yellow-600"> support@eazika.com</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}