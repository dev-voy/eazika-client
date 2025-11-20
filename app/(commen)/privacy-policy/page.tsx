"use client";

import React from 'react';
import { 
    ArrowLeft, 
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Main Page Component ---
export default function PrivacyPolicyPage() {

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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Privacy Policy</h1>
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

            <h2 id="introduction">1. Information We Collect</h2>
            <p>
              We collect information to provide and improve our Service. The types of
              information we may collect include:
            </p>
            <ul>
              <li>
                <strong>Personal Data:</strong> While using our Service, we may ask you to
                provide us with certain personally identifiable information that can be
                used to contact or identify you ("Personal Data"). This may include, but
                is not limited to, your email address, name, phone number, and delivery address.
              </li>
              <li>
                <strong>Usage Data:</strong> We may also collect information that your
                browser sends whenever you visit our Service or when you access the
                Service by or through a mobile device ("Usage Data").
              </li>
            </ul>

            <h2 id="use-of-data">2. Use of Data</h2>
            <p>
              Eazika uses the collected data for various purposes:
            </p>
            <ul>
              <li>To provide and maintain our Service.</li>
              <li>To notify you about changes to our Service.</li>
              <li>To provide customer support.</li>
              <li>To monitor the usage of our Service.</li>
              <li>To detect, prevent, and address technical issues.</li>
            </ul>

            <h2 id="data-security">3. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method
              of transmission over the Internet or method of electronic storage is
              100% secure. While we strive to use commercially acceptable means to
              protect your Personal Data, we cannot guarantee its absolute security.
            </p>

            <h2 id="third-party">4. Third-Party Service Providers</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our
              Service ("Service Providers"), provide the Service on our behalf,
              perform Service-related services, or assist us in analyzing how our
              Service is used. These third parties have access to your Personal Data
              only to perform these tasks on our behalf and are obligated not to
              disclose or use it for any other purpose.
            </p>

            <h2 id="links-to-other-sites">5. Links to Other Sites</h2>
            <p>
              Our Service may contain links to other sites that are not operated by us.
              If you click a third-party link, you will be directed to that third
              party's site. We strongly advise you to review the Privacy Policy of
              every site you visit.
            </p>

            <h2 id="contact">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <a href="mailto:support@eazika.com" className="text-yellow-500 hover:text-yellow-600"> support@eazika.com</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}