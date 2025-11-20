"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft,
    CheckCircle, 
    RefreshCw, 
    XCircle,
    MapPin,
    ListOrdered,
    Package,
    Clock,
    Truck,
    AlertCircle,
    User,
    Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- Mock Router Hooks ---
// These simulate Next.js router hooks for getting the current path and params.
const usePathname = () => {
    const [pathname, setPathname] = useState(typeof window !== 'undefined' ? window.location.pathname : "/dashboard/orders/EAZ123"); 
    useEffect(() => {
        const updatePath = () => setPathname(window.location.pathname);
        window.addEventListener('popstate', updatePath);
        updatePath();
        return () => window.removeEventListener('popstate', updatePath);
    }, []);
    return pathname;
};

const useParams = () => {
    const pathname = usePathname();
    // This extracts the last segment of the URL (the ID)
    const parts = pathname.split('/');
    const id = parts[parts.length - 1]; 
    return { id };
};

// --- Mock Data & Types ---
type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled';

type MockItem = { name: string, quantity: number, price: number };

type MockOrderDetail = {
    id: string;
    customerName: string;
    timePlaced: string;
    deliveryAddress: string;
    total: string;
    status: OrderStatus;
    items: MockItem[];
    deliveryTimeEstimate: string;
    subtotal: number;
    deliveryFee: number;
};

// Collection of mock orders to demonstrate dynamic loading
const allOrderDetails: MockOrderDetail[] = [
    // EAZ123 (Pending)
    {
        id: 'EAZ123',
        customerName: 'Ratul Islam',
        timePlaced: '2025-11-10T10:00:00Z',
        deliveryAddress: 'Apt 4B, 123 Main St, Springfield, 62704. Contact: 9988776655',
        total: '$45.00',
        status: 'Pending',
        items: [
            { name: 'Lays Potato Chips - Classic', quantity: 2, price: 3.50 },
            { name: 'Coca-Cola Can - 330ml', quantity: 4, price: 1.50 },
            { name: 'Whole Wheat Bread', quantity: 1, price: 4.20 },
        ],
        deliveryTimeEstimate: '30 - 45 min',
        subtotal: 24.60,
        deliveryFee: 5.00,
    },
    // EAZ124 (Ready for Handover)
    {
        id: 'EAZ124',
        customerName: 'Mike Johnson',
        timePlaced: '2025-11-10T09:30:00Z',
        deliveryAddress: 'House 1A, Oakwood Lane, Shelbyville, 62705. Contact: 1122334455',
        total: '$150.75',
        status: 'Ready',
        items: [
            { name: 'Premium Salmon Fillet', quantity: 1, price: 25.00 },
            { name: 'Organic Spinach', quantity: 2, price: 3.50 },
            { name: 'Red Wine Bottle', quantity: 1, price: 45.00 },
        ],
        deliveryTimeEstimate: '15 - 30 min',
        subtotal: 145.75,
        deliveryFee: 5.00,
    },
    // EAZ125 (Completed)
    {
        id: 'EAZ125',
        customerName: 'Sara Lee',
        timePlaced: '2025-11-09T15:00:00Z',
        deliveryAddress: 'Flat 12, Riverwalk Towers, Capital City, 62700. Contact: 5544332211',
        total: '$88.00',
        status: 'Completed',
        items: [
            { name: 'Milk Carton', quantity: 2, price: 2.50 },
            { name: 'Eggs - Dozen', quantity: 1, price: 4.00 },
            { name: 'Coffee Beans - Arabica', quantity: 1, price: 25.00 },
        ],
        deliveryTimeEstimate: 'N/A',
        subtotal: 80.00,
        deliveryFee: 8.00,
    },
];

// --- Helper Functions ---
const getStatusInfo = (status: OrderStatus) => {
    switch(status) {
        case 'Pending':
            return { icon: Clock, color: 'text-yellow-600', text: 'Waiting for acceptance' };
        case 'Preparing':
            return { icon: RefreshCw, color: 'text-blue-600', text: 'Preparing items now' };
        case 'Ready':
            return { icon: Package, color: 'text-indigo-600', text: 'Ready for handover' };
        case 'Out for Delivery':
            return { icon: Truck, color: 'text-teal-600', text: 'Out for delivery' };
        case 'Completed':
            return { icon: CheckCircle, color: 'text-green-600', text: 'Delivered successfully' };
        case 'Cancelled':
            return { icon: XCircle, color: 'text-red-600', text: 'Order cancelled' };
        default:
            return { icon: AlertCircle, color: 'text-gray-500', text: 'Status unknown' };
    }
};

// --- Loading and Error Components ---

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <Loader className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
        <p className="text-lg font-semibold">Loading Order Details...</p>
    </div>
);

const ErrorState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-64 text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-gray-800 rounded-xl border border-red-300">
        <AlertCircle className="w-8 h-8 mb-4" />
        <p className="text-lg font-bold">Error: Order Not Found</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{message}</p>
    </div>
);


// --- Main Page Component ---
export default function ShopkeeperOrderDetailPage() {
    
    // Dynamic State Management
    const { id } = useParams();
    const [order, setOrder] = useState<MockOrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dynamic Data Fetching
    useEffect(() => {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        const timer = setTimeout(() => {
            const orderData = allOrderDetails.find(o => o.id.toLowerCase() === id.toLowerCase());
            
            if (orderData) {
                // IMPORTANT: We clone the object to allow the UI to modify the status via handleUpdateStatus
                setOrder(orderData);
            } else {
                setError(`The order ID '${id}' could not be found.`);
            }
            setIsLoading(false);
        }, 300); // Small delay to show loading state

        return () => clearTimeout(timer); // Cleanup timer
    }, [id]);

    // Dynamic actions and status styles
    const statusInfo = order ? getStatusInfo(order.status) : null;

    const handleBack = () => {
        // Navigate back to the main orders list
        if (typeof window !== 'undefined' && (window as any).setMockPathname) {
             (window as any).setMockPathname('/dashboard/orders');
        } else {
             window.location.href = '/dashboard/orders';
        }
    };

    const handleUpdateStatus = (newStatus: OrderStatus, actionText: string) => {
        if (!order) return;

        if (order.status === 'Cancelled' || order.status === 'Completed') {
            toast.error("Cannot change status of final order.");
            return;
        }

        setOrder(prev => (prev ? { ...prev, status: newStatus } : null));
        toast.success(`Order ${order.id}: ${actionText}`);
    };

    // Determine primary action button
    const getPrimaryAction = () => {
        if (!order) return null;
        switch (order.status) {
            case 'Pending':
                return {
                    text: "Accept Order & Start Preparing",
                    icon: RefreshCw,
                    onClick: () => handleUpdateStatus('Preparing', 'Preparation started'),
                    color: 'bg-green-500 hover:bg-green-600'
                };
            case 'Preparing':
                return {
                    text: "Mark Ready for Delivery",
                    icon: Package,
                    onClick: () => handleUpdateStatus('Ready', 'Marked ready for delivery'),
                    color: 'bg-yellow-500 hover:bg-yellow-600'
                };
            case 'Ready':
                return {
                    text: "Handover to Delivery Boy",
                    icon: Truck,
                    onClick: () => handleUpdateStatus('Out for Delivery', 'Handed over for delivery'),
                    color: 'bg-blue-500 hover:bg-blue-600'
                };
            default:
                return null; // No primary action for Out for Delivery, Completed, or Cancelled
        }
    };

    const primaryAction = getPrimaryAction();
    const totalAmount = order ? parseFloat(order.total.replace('$', '')) : 0;
    
    // --- Render States ---
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!order || !statusInfo) return null; // Should be unreachable if error handled

    return (
        <motion.div 
            className="space-y-6 pb-24" // Extra padding for fixed action bar
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Header */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    onClick={handleBack}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Back to Orders"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order: {order.id}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Placed {new Date(order.timePlaced).toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Status Card (Always visible at the top) */}
            <motion.div 
                className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border-l-4 ${statusInfo.color.replace('text-', 'border-')} flex items-center justify-between`}
            >
                <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status:</span>
                    <h2 className={`text-xl font-bold mt-1 ${statusInfo.color} flex items-center gap-2`}>
                        <statusInfo.icon className={`w-5 h-5 ${order.status === 'Preparing' ? 'animate-spin' : ''}`} />
                        {order.status}
                    </h2>
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total:</span>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{order.total}</p>
                </div>
            </motion.div>


            {/* Details Grid (Items and Delivery) */}
            <div className="grid grid-cols-1 gap-6">

                {/* Order Items List */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                    <div className="flex items-center gap-2 p-4 border-b dark:border-gray-700">
                        <ListOrdered className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Items ({order.items.length})</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 dark:text-white">{item.quantity}x</span>
                                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Delivery and Customer Info */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-2 p-4 border-b dark:border-gray-700">
                        <MapPin className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delivery Details</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Customer:</p>
                                <p className="text-gray-600 dark:text-gray-400">{order.customerName}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Address:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{order.deliveryAddress}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Estimate:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{order.deliveryTimeEstimate} from dispatch</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Price Summary */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-2"
                >
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Delivery Fee:</span>
                        <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-dashed dark:border-gray-700/50">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Order Total:</span>
                        <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">${totalAmount.toFixed(2)}</span>
                    </div>
                </motion.div>
            </div>

            {/* --- Fixed Action Bar --- */}
            {primaryAction && (
                <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white dark:bg-gray-800 border-t shadow-2xl border-gray-100 dark:border-gray-700"
                >
                    <button
                        onClick={primaryAction.onClick}
                        className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl text-white transition-colors shadow-md ${primaryAction.color}`}
                    >
                        <primaryAction.icon className="w-5 h-5" />
                        {primaryAction.text}
                    </button>
                    
                    {/* Secondary Action: Cancel */}
                    {order.status !== 'Cancelled' && (
                        <button
                            onClick={() => handleUpdateStatus('Cancelled', 'Order cancelled by shop')}
                            className="w-full mt-3 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 font-semibold"
                        >
                            Cancel Order
                        </button>
                    )}
                </motion.div>
            )}

        </motion.div>
    );
}