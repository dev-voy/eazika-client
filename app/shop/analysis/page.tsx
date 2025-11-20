"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    DollarSign, 
    Landmark, 
    Clock,
    Download,
    CheckCircle,
    XCircle,
    Banknote, 
    ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- Mock Data (Self-Contained) ---
const PENDING_PAYOUT_AMOUNT = 820.00;

const earningsStats = [
    { 
        id: 1, 
        title: "Total Revenue", 
        value: "$12,450", 
        icon: DollarSign,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/40"
    },
    { 
        id: 2, 
        title: "Pending Payout", 
        value: `$${PENDING_PAYOUT_AMOUNT.toFixed(2)}`, 
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/40"
    },
    { 
        id: 3, 
        title: "Last Payout", 
        value: "$1,500", 
        icon: Landmark,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/40"
    },
];

type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

type MockTransaction = {
    id: string;
    date: string;
    amount: string;
    status: TransactionStatus;
    type: 'Payout' | 'Order';
};

const recentTransactions: MockTransaction[] = [
    { id: 'PAYOUT-003', date: 'Nov 10, 2025', amount: '- $1,500.00', status: 'Completed', type: 'Payout' },
    { id: 'EAZ-123', date: 'Nov 10, 2025', amount: '+ $45.00', status: 'Completed', type: 'Order' },
    { id: 'EAZ-122', date: 'Nov 10, 2025', amount: '+ $120.00', status: 'Completed', type: 'Order' },
    { id: 'PAYOUT-002', date: 'Nov 03, 2025', amount: '- $2,100.00', status: 'Completed', type: 'Payout' },
    { id: 'PAYOUT-001', date: 'Oct 27, 2025', amount: '- $1,850.00', status: 'Failed', type: 'Payout' },
];
// --- End Mock Data ---

// --- Helper Components ---
const StatsCard = ({ item }: { item: typeof earningsStats[0] }) => (
    <motion.div 
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgColor} shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</span>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{item.value}</p>
            </div>
        </div>
    </motion.div>
);

const getStatusIcon = (status: TransactionStatus) => {
    switch(status) {
        case 'Completed':
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'Pending':
            return <Clock className="w-4 h-4 text-yellow-500" />;
        case 'Failed':
            return <XCircle className="w-4 h-4 text-red-500" />;
    }
};

const TransactionListItem = ({ txn }: { txn: MockTransaction }) => {
    const statusIcon = getStatusIcon(txn.status);
    const amountColor = txn.amount.trim().startsWith('+') ? 'text-green-500' : 'text-red-500';
    const typeBadgeClass = txn.type === 'Order' 
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';

    return (
        <motion.a
            href={`/dashboard/transactions/${txn.id}`} // Mock link
            variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
            className="flex justify-between items-center p-4 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
        >
            {/* Left: ID, Type, Date */}
            <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-800 dark:text-white text-sm">
                    {txn.id}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${typeBadgeClass}`}>
                    {txn.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {txn.date}
                </span>
            </div>

            {/* Right: Amount, Status, Action Icon */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className={`text-base font-bold ${amountColor}`}>{txn.amount}</span>
                    <div className="flex items-center gap-1 mt-1">
                        {statusIcon}
                        <span className="text-xs text-gray-600 dark:text-gray-400">{txn.status}</span>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
        </motion.a>
    );
};
// --- End Helper Components ---


// --- Main Page Component ---
export default function ShopkeeperEarningsPage() {
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const handleWithdraw = () => {
        // Mock function for withdrawing funds
        // Replaced alert() with a toast for compliance
        toast.success(`Requesting withdrawal of $${PENDING_PAYOUT_AMOUNT.toFixed(2)}. Payout initiated!`);
    };

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header and Download Button */}
            <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col pt-2"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Hub 💰</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Track your revenue and manage payouts.</p>
                </div>
                <button
                    className="w-full shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 text-gray-900 font-bold rounded-xl hover:bg-yellow-600 transition-colors shadow-md mt-4"
                >
                    <Download className="w-5 h-5" />
                    Download Full Report
                </button>
            </motion.div>

            {/* Withdraw Action (Prominent Top Card) */}
            <motion.div 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border-2 border-yellow-400 dark:border-yellow-500"
            >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Available for Payout</h3>
                <p className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400 mb-4">
                    ${PENDING_PAYOUT_AMOUNT.toFixed(2)}
                </p>
                <button
                    onClick={handleWithdraw}
                    className="w-full shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-md"
                >
                    <Banknote className="w-5 h-5" />
                    Withdraw Funds Now
                </button>
            </motion.div>

            {/* Stats Cards (2-column layout on mobile) */}
            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 gap-4"
            >
                {/* Filter out Pending Payout since it's now a dedicated card */}
                {earningsStats.filter(s => s.id !== 2).map(item => (
                    <StatsCard key={item.id} item={item} />
                ))}
            </motion.div>

            {/* Revenue Chart */}
            <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Weekly Revenue Trend 📈</h2>
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue Chart Placeholder</p>
                </div>
            </motion.div>
                
            {/* Recent Transactions (Mobile List) */}
            <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                    <a href="#" className="text-sm font-semibold text-yellow-500 hover:text-yellow-600 transition-colors">
                        View All
                    </a>
                </div>
                
                {/* List of Transactions */}
                <motion.div variants={containerVariants}>
                    {recentTransactions.map(txn => (
                        <TransactionListItem key={txn.id} txn={txn} />
                    ))}
                </motion.div>
            </motion.div>
            
        </motion.div>
    );
}