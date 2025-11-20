"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Bike, Clock, XCircle, ChevronUp, User, Phone, MapPin, Loader2 } from "lucide-react";
import { useCustomerOrderStore } from "@/app/hooks/useCustomerOrderStore";
import { Modal } from "@/app/components/Modal"; 
import { CustomerBottomNav } from "@/app/components/CustomerBottomNav"; 
import { CustomerHeader } from "@/app/components/CustomerHeader"; 
import clsx from 'clsx'; 

// Assume Order Statuses for tracking
type TrackingStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'preparing' | 'on_way';

// Mock Tracking Data structure based on API
interface TrackingData {
    orderId: number;
    status: TrackingStatus;
    currentLocation: string;
    estimatedDelivery: string;
    deliveryBoy: {
        name: string;
        phone: string;
    };
}

const initialMockTrackingData: TrackingData = {
    orderId: 999,
    status: 'on_way',
    currentLocation: "1.5 km away from your location",
    estimatedDelivery: new Date(Date.now() + 15 * 60000).toISOString(), // 15 mins from now
    deliveryBoy: {
        name: "Rahul Kumar (EAZIKA)",
        phone: "+91 98765 43210",
    }
};

const cancellationReasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found better price elsewhere",
    "Long delivery time",
];

export default function TrackOrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id') || useCustomerOrderStore(state => state.activeOrderId); 

    const { deliveryOtp, cancelOrder } = useCustomerOrderStore();
    const [trackingData, setTrackingData] = useState<TrackingData | null>(initialMockTrackingData);
    const [isLoading, setIsLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(cancellationReasons[0]);
    const [successMessageOpen, setSuccessMessageOpen] = useState(false);
    
    // Default to false (desktop view)
    const [isMobile, setIsMobile] = useState(false); 

    // --- Responsive State & Motion Setup ---
    const constraintsRef = useRef(null);
    const panelHeight = 350; 
    const peekHeight = 100; 
    const dragRange = panelHeight - peekHeight;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Motion values (called unconditionally)
    const y = useMotionValue(0); 
    const dragControls = { top: -dragRange, bottom: 0 }; 
    const arrowRotation = useTransform(y, [0, -dragRange], [0, 180]);
    const contentOpacity = useTransform(y, [0, -dragRange], [0.1, 1]); 
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 

    useEffect(() => {
        if (!orderId) {
            alert("No active order to track.");
            router.push('/home');
        }
    }, [orderId, router]);

    const handleCancelOrder = async () => {
        if (!orderId) return;

        setIsCancelling(true);
        try {
            const res = await fetch(`${API_URL}/customers/cancel-order-by-customer/${orderId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ reason: selectedReason }),
            });

            if (res.ok) {
                cancelOrder(); 
                setTrackingData(prev => prev ? {...prev, status: 'cancelled'} : null);
                setIsCancelModalOpen(false);
                setSuccessMessageOpen(true);
                setTimeout(() => router.push('/home'), 2000); 
            } else {
                const data = await res.json();
                alert(data.message || "Cancellation failed. Order status might be too advanced.");
            }
        } catch (error) {
            console.error("Cancellation Error:", error);
            alert("Network error. Could not process cancellation.");
        } finally {
            setIsCancelling(false);
        }
    };


    if (isLoading || !trackingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] dark:text-white">
                <Loader2 className="animate-spin w-8 h-8 text-yellow-500" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading order details...</p>
            </div>
        );
    }
    
    const isCancellable = trackingData.status !== 'shipped' && trackingData.status !== 'delivered' && trackingData.status !== 'cancelled';
    const deliveryTime = new Date(trackingData.estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // --- Panel Content Definitions ---
    
    const PeekPanelContent = (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Bike className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-sm font-semibold dark:text-white">{trackingData.deliveryBoy.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Partner</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{trackingData.status.toUpperCase().replace('_', ' ')}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end">
            <Clock className="w-3 h-3 mr-1" /> ETA: {deliveryTime}
          </p>
        </div>
      </div>
    );

    const FullPanelContent = (
        <div className="p-4 pt-0 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold dark:text-white">Order Details - #{trackingData.orderId}</h3>
                <Link href={`/orders/${orderId}`} className="text-sm text-yellow-600 hover:underline">View Items</Link>
            </div>

            {/* OTP Section (Prominent) */}
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-xl text-center shadow-inner border border-yellow-300 dark:border-yellow-700">
                <p className="text-sm font-medium text-gray-700 dark:text-yellow-200">Your Delivery OTP</p>
                <p className="text-5xl font-extrabold text-yellow-600 dark:text-yellow-400 tracking-widest mt-1">
                    {deliveryOtp}
                </p>
                <p className="text-xs text-gray-500 dark:text-yellow-300/70 mt-1">Share this with Rahul only upon delivery.</p>
            </div>

            {/* Delivery Partner Info */}
            <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="w-5 h-5 text-gray-500" />
                    <p className="text-sm dark:text-gray-300">{trackingData.deliveryBoy.name}</p>
                    <a href={`tel:${trackingData.deliveryBoy.phone}`} className="ml-auto text-yellow-600 dark:text-yellow-400 text-sm font-semibold">
                        <Phone className="w-4 h-4 inline-block mr-1" /> Call
                    </a>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <p className="text-sm dark:text-gray-300 truncate">{trackingData.currentLocation}</p>
                </div>
            </div>

            {/* Cancellation Button */}
            {isCancellable && (
                <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full mt-4 flex items-center justify-center bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition-colors active:scale-98 shadow-md"
                >
                    <XCircle className="w-5 h-5 mr-2" />
                    Cancel Order
                </button>
            )}
            
            {!isCancellable && trackingData.status === 'cancelled' && (
                <div className="w-full mt-4 text-center text-red-500 font-semibold p-3 border border-red-200 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/20">
                    Order has been cancelled.
                </div>
            )}
        </div>
    );

    // --- Main Layout ---
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col transition-colors duration-300">
            <CustomerHeader /> 
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grow w-full">

            {/* Map Area Simulation (Placeholder) */}
            <div 
                // Mobile: 100% viewport height minus header, bottom nav, and panel peek height (approx 140px + 100px)
                // Desktop: Height adjusted to 100vh minus header and small margin, allowing the static panel to appear below it.
                className={clsx(
                    "w-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 rounded-xl shadow-inner my-4",
                    isMobile ? "h-[calc(100vh-270px)]" : "h-[calc(100vh-200px)]"
                )}
            >
                <div className="text-center p-8">
                    <MapPin className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                    <p>Live Map Tracking Area</p>
                    <p className="text-sm">Driver is {trackingData.currentLocation}</p>
                </div>
            </div>
            </main> 

            {/* Slide-Up Panel Container - Conditional Positioning */}
            <div 
                className={clsx(
                    // Mobile fixed positioning (bottom-16 above nav, high z-index)
                    "fixed inset-x-0 bottom-16 z-40 rounded-t-3xl",
                    // Desktop static positioning (in flow, lower z-index, rounded corners)
                    "md:relative md:bottom-auto md:max-w-full md:mx-auto md:mb-4 md:z-30 md:rounded-xl"
                )} 
                ref={constraintsRef}
            > 
                <motion.div
                    className={clsx(
                        "w-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-hidden",
                        // Mobile: fixed height for drag mechanism
                        isMobile ? "h-[350px]" : "h-auto" 
                    )}
                    // Apply motion properties only if on mobile.
                    style={isMobile ? { y } : { y: 0 }}
                    drag={isMobile ? "y" : false}
                    dragConstraints={dragControls}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragEnd={(event, info) => {
                        if (!isMobile) return;
                        if (info.offset.y < -dragRange / 2) {
                            y.stop();
                            y.set(-dragRange); // Snap to Max
                        } else {
                            y.stop();
                            y.set(0); // Snap to Peek
                        }
                    }}
                >
                    {/* Handle/Peek Bar (Mobile only) */}
                    {isMobile && (
                        <div className="sticky top-0 w-full p-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 cursor-grab active:cursor-grabbing">
                            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 mx-auto rounded-full mb-1" />
                        </div>
                    )}
                    
                    {/* Peek View (Mobile only) */}
                    {isMobile && (
                        <div className="h-20 overflow-hidden">
                            {PeekPanelContent}
                        </div>
                    )}

                    {/* Full Content View */}
                    <div className={clsx(
                        "pt-2",
                        // Mobile: constrained height
                        {
                            "h-[250px]": isMobile, // 350 (total) - 100 (peek) = 250
                            "h-auto": !isMobile, // Desktop: auto height for full content
                            "pt-5": !isMobile, // Add top padding on desktop when peek bar is absent
                        }
                    )}>
                        <motion.div 
                            // Apply opacity transformation only on mobile during drag
                            style={isMobile ? { opacity: contentOpacity } : { opacity: 1 }}
                        >
                            {FullPanelContent}
                        </motion.div>
                    </div>

                    {/* Draggable Arrow Indicator (Mobile only) */}
                    {isMobile && (
                        <motion.div 
                            className="absolute right-6 top-5 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors pointer-events-none"
                            style={{ rotate: arrowRotation }}
                        >
                            <ChevronUp size={20} />
                        </motion.div>
                    )}
                </motion.div>
            </div>
            
            <CustomerBottomNav />
            
            {/* Cancellation Modal */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                title="Cancel Order Confirmation"
                footer={(
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={() => setIsCancelModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors active:scale-95 disabled:opacity-70 flex items-center"
                        >
                            {isCancelling ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                            Yes, Cancel Now
                        </button>
                    </div>
                )}
            >
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Are you sure you want to cancel Order #{orderId}? Please select a reason:
                </p>
                <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                    {cancellationReasons.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                    ))}
                </select>
            </Modal>
            
            {/* Success Message Pop-up (Reusing Modal but simplified) */}
            <Modal
                isOpen={successMessageOpen}
                onClose={() => setSuccessMessageOpen(false)}
                title="Order Cancelled Successfully!"
                maxWidth="max-w-xs"
            >
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">Cancellation Confirmed.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We are redirecting you to the home page.</p>
                </div>
            </Modal>
        </div>
    );
}