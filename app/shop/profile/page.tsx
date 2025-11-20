"use client";

import React from 'react';
// ... (rest of the file is identical to app/(shopkeeper)/profile/page.tsx)
import { 
    User, 
    ChevronRight, 
    Store, 
    MapPin, 
    Phone, 
    FileBadge, 
    Landmark, 
    LogOut,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data based on the provided image
const shopkeeperProfile = {
  name: "Mr. Shopkeeper",
  id: "EAZIKA-SK-12345",
  businessName: "Eazika Grocers",
  businessAddress: "123 Commerce St, Nagpur, MH 440001",
  businessContact: "+91 12345 67890",
  kycStatus: "Verified",
  bankName: "State Bank of India",
  bankAccountNo: "XXXX XXXX 6789",
  ifscCode: "SBIN0001234"
};

// Reusable component for profile list items
const ProfileItem = ({ 
    icon: Icon, 
    label, 
    value, 
    href, 
    valueColor 
}: { 
    icon: React.ElementType, 
    label: string, 
    value: string, 
    href: string, 
    valueColor?: string 
}) => (
  <a 
    href={href} 
    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
  >
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500" />
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`font-semibold text-gray-900 dark:text-white ${valueColor ? valueColor : ''}`}>
          {value}
        </p>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
  </a>
);

export default function ShopkeeperProfilePage() {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div 
            className="max-w-3xl mx-auto space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Card */}
            <motion.div 
                variants={itemVariants}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{shopkeeperProfile.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {shopkeeperProfile.id}</p>
                </div>
            </motion.div>

            {/* Business Information Section */}
            <motion.div variants={itemVariants}>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">BUSINESS INFORMATION</h2>
                <div className="space-y-3">
                    <ProfileItem 
                        icon={Store}
                        label="Shop Name"
                        value={shopkeeperProfile.businessName}
                        href="/dashboard/profile/business-info"
                    />
                    <ProfileItem 
                        icon={MapPin}
                        label="Shop Address"
                        value={shopkeeperProfile.businessAddress}
                        href="/dashboard/profile/business-info"
                    />
                    <ProfileItem 
                        icon={Phone}
                        label="Shop Contact"
                        value={shopkeeperProfile.businessContact}
                        href="/dashboard/profile/business-info"
                    />
                </div>
            </motion.div>

            {/* KYC Section */}
            <motion.div variants={itemVariants}>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">KYC & BANK</h2>
                <div className="space-y-3">
                    <ProfileItem 
                        icon={FileBadge}
                        label="KYC Status"
                        value={shopkeeperProfile.kycStatus}
                        href="/dashboard/profile/kyc"
                        valueColor={shopkeeperProfile.kycStatus === "Verified" ? "text-green-500" : "text-red-500"}
                    />
                    <ProfileItem 
                        icon={Landmark}
                        label={shopkeeperProfile.bankName}
                        value={`A/C: ${shopkeeperProfile.bankAccountNo}`}
                        href="/dashboard/profile/bank-details"
                    />
                </div>
            </motion.div>

             {/* Logout Button */}
             <motion.div variants={itemVariants} className="pt-4">
                <a
                    href="/login" // In a real app, this would be a function that calls signOut
                    className="flex items-center justify-center gap-3 w-full p-4 bg-red-50 dark:bg-red-900/30 rounded-xl shadow-sm border border-red-100 dark:border-red-700/50 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors group"
                >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-red-500">Log Out</span>
                </a>
            </motion.div>
            
        </motion.div>
    );
}