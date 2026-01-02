"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Users,
    Bike,
    CheckCircle,
    Clock,
    Phone,
    MoreVertical,
    Loader2,
    X,
    Send,
    User,
    Star,
    Ban,
    MapPin,
    FileText,
    Eye,
    XCircle,
    BarChart3,
    History,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopService, ShopRider, UserProfile } from '@/services/shopService';
import Image from 'next/image';

export default function RidersPage() {
    const [riders, setRiders] = useState<ShopRider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Invite Modal State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [invitePhone, setInvitePhone] = useState('');
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);

    // Rider Details Modal State
    const [selectedRider, setSelectedRider] = useState<ShopRider | null>(null);
    const [modalTab, setModalTab] = useState<'overview' | 'analytics' | 'history' | 'docs'>('overview');

    useEffect(() => {
        fetchRiders();
    }, []);

    const fetchRiders = async () => {
        try {
            const data = await ShopService.getShopRiders();
            console.log("Riders data:", data);
            setRiders(data);
        } catch (error) {
            console.error("Failed to load riders", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Stats Calculation
    const stats = [
        { title: 'Total Riders', value: riders.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { title: 'Active Now', value: riders.filter(r => r.status !== 'offline').length, icon: Bike, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
        { title: 'Busy', value: riders.filter(r => r.status === 'busy').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        { title: 'Total Deliveries', value: riders.reduce((acc, r) => acc + (r.totalDeliveries || 0), 0), icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    ];

    const filteredRiders = riders.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery)
    );

    // --- Invite Handlers ---

    const handleSearchUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (invitePhone.length < 10) {
            alert("Please enter a valid phone number");
            return;
        }
        setIsSearching(true);
        setFoundUser(null);
        setInviteSent(false);

        try {
            const user = await ShopService.searchUserByPhone(invitePhone);
            setFoundUser(user);
        } catch (error) {
            alert("User not found with this phone number.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendInvite = async () => {
        if (!foundUser) return;
        setIsSending(true);
        try {
            await ShopService.sendRiderInvite(foundUser.id);
            setInviteSent(true);
        } catch (error) {
            alert("Failed to send invite.");
        } finally {
            setIsSending(false);
        }
    };

    const resetModal = () => {
        setShowInviteModal(false);
        setInvitePhone('');
        setFoundUser(null);
        setInviteSent(false);
    };

    const openRiderModal = (rider: ShopRider) => {
        setSelectedRider(rider);
        setModalTab('overview');
    };

    const handleSuspend = async (riderId: number) => {
        if (!confirm('Are you sure you want to suspend this rider?')) return;
        try {
            // Add suspend API call here
            console.log('Suspending rider:', riderId);
            // await ShopService.suspendRider(riderId);
            fetchRiders();
        } catch (error) {
            console.error('Failed to suspend rider', error);
        }
    };

    return (
        <div className="space-y-6 pb-24 md:pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Partners</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your delivery fleet.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                    <Plus size={20} /> Add New Rider
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                                <Icon size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search riders by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Riders Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-500" size={32} /></div>
            ) : filteredRiders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredRiders.map((rider) => (
                            <motion.div
                                key={rider.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all group ${rider.status === 'pending'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-700'
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                            {rider.image ? (
                                                <Image src={rider.image} alt={rider.name} width={48} height={48} className="object-cover" />
                                            ) : (
                                                <User className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{rider.vehicleOwnerName}</h3>
                                            <span>{rider.user.phone}</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className={`w-2 h-2 rounded-full ${rider.status === 'available' ? 'bg-green-500' :
                                                    rider.status === 'busy' ? 'bg-orange-500' :
                                                        rider.status === 'pending' ? 'bg-yellow-500' :
                                                            'bg-gray-400'
                                                    }`} />
                                                <span className="text-xs text-gray-500 capitalize font-medium">
                                                    {rider.status === 'pending' ? 'Pending Approval' : rider.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {rider.status !== 'pending' && (
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <MoreVertical size={18} />
                                        </button>
                                    )}
                                </div>

                                {rider.status === 'pending' ? (
                                    <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-20">
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (!confirm("Reject request?")) return;
                                                await ShopService.rejectRider(rider.id);
                                                fetchRiders();
                                            }}
                                            className="py-2 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200 flex items-center justify-center gap-1"
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await ShopService.approveRider(rider.id);
                                                fetchRiders();
                                            }}
                                            className="py-2 rounded-xl bg-yellow-500 text-white font-bold text-xs hover:bg-yellow-600 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle size={14} /> Accept
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openRiderModal(rider);
                                            }}
                                            className="py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs hover:bg-blue-200 flex items-center justify-center gap-1"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
                                            <div className="text-center flex-1 border-r border-gray-100 dark:border-gray-700">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{rider.activeOrders}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Active</p>
                                            </div>
                                            <div className="text-center flex-1 border-r border-gray-100 dark:border-gray-700">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{rider.totalDeliveries}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
                                            </div>
                                            <div className="text-center flex-1">
                                                <p className="text-lg font-bold text-yellow-500 flex items-center justify-center gap-1">
                                                    {rider.rating} <Star size={12} fill="currentColor" />
                                                </p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Rating</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSuspend(rider.id);
                                                }}
                                                className="py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 flex items-center justify-center gap-1"
                                            >
                                                <Ban size={14} /> Suspend
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openRiderModal(rider);
                                                }}
                                                className="py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs hover:bg-blue-200 flex items-center justify-center gap-1"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                    <Users size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Riders Found</h3>
                    <p className="text-sm text-gray-500">Add delivery partners to start managing your fleet.</p>
                </div>
            )}

            {/* --- Invite Modal --- */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Rider</h3>
                                <button onClick={resetModal} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {!foundUser ? (
                                /* Step 1: Search */
                                <form onSubmit={handleSearchUser} className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Rider&apos;s Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter 10-digit mobile number"
                                            value={invitePhone}
                                            onChange={(e) => setInvitePhone(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-yellow-500 transition-colors"
                                            autoFocus
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            The user must be registered on Eazika to be invited.
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSearching || invitePhone.length < 10}
                                        className="w-full py-3.5 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSearching ? <Loader2 className="animate-spin" /> : "Search User"}
                                    </button>
                                </form>
                            ) : (
                                /* Step 2: Confirm & Invite */
                                <div className="space-y-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                                            {foundUser.image ? (
                                                <Image src={foundUser.image} alt={foundUser.name} width={80} height={80} className="object-cover" />
                                            ) : (
                                                <User size={32} className="text-gray-400" />
                                            )}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{foundUser.name}</h4>
                                        <p className="text-sm text-gray-500">{foundUser.phone}</p>
                                    </div>

                                    {inviteSent ? (
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                                            <p className="text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2">
                                                <CheckCircle size={18} /> Invite Sent!
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                                                They will receive an SMS to join your shop.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleSendInvite}
                                                disabled={isSending}
                                                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                            >
                                                {isSending ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Invite</>}
                                            </button>
                                            <button
                                                onClick={() => setFoundUser(null)}
                                                className="w-full py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Search Different Number
                                            </button>
                                        </div>
                                    )}

                                    {inviteSent && (
                                        <button
                                            onClick={resetModal}
                                            className="w-full py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Done
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- Rider Details Modal --- */}
            <AnimatePresence>
                {selectedRider && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 pb-0 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center overflow-hidden">
                                            {selectedRider.image ? (
                                                <Image src={selectedRider.image} alt={selectedRider.name} width={64} height={64} className="object-cover" />
                                            ) : (
                                                <Bike size={32} className="text-yellow-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRider.name}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${selectedRider.status === 'available' ? 'bg-green-100 text-green-700' :
                                                    selectedRider.status === 'busy' ? 'bg-orange-100 text-orange-700' :
                                                        selectedRider.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {selectedRider.status}
                                                </span>
                                                <span className="text-gray-400 text-xs">• ID: #{selectedRider.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedRider(null)} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-1 overflow-x-auto">
                                    <button
                                        onClick={() => setModalTab('overview')}
                                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${modalTab === 'overview'
                                            ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Overview
                                    </button>
                                    {selectedRider.status !== 'pending' && (
                                        <>
                                            <button
                                                onClick={() => setModalTab('analytics')}
                                                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${modalTab === 'analytics'
                                                    ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                    }`}
                                            >
                                                Analytics
                                            </button>
                                            <button
                                                onClick={() => setModalTab('history')}
                                                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${modalTab === 'history'
                                                    ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                    }`}
                                            >
                                                History
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setModalTab('docs')}
                                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${modalTab === 'docs'
                                            ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Documents
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto">
                                {/* TAB: OVERVIEW */}
                                {modalTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Contact Information</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
                                                        <Phone size={16} className="text-blue-500" /> {selectedRider.phone}
                                                    </div>
                                                    <a href={`tel:${selectedRider.phone}`} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                                        Call Now
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Verification Status</p>
                                                <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
                                                    {selectedRider.isVerified ? (
                                                        <><CheckCircle size={16} className="text-green-500" /> Verified</>
                                                    ) : (
                                                        <><Clock size={16} className="text-orange-500" /> Pending Verification</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Aadhar Number</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedRider.aadharNumber || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">PAN Number</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedRider.panNumber || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">License Number</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedRider.licenseNumber || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Vehicle Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Owner Name</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedRider.vehicleOwnerName || 'N/A'}</p>
                                                </div>
                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Vehicle Name</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedRider.vehicleName || 'N/A'}</p>
                                                </div>
                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Vehicle Number</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedRider.vehicleNo || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedRider.status !== 'pending' && (
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Performance Stats</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                    <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                                        <p className="text-2xl font-bold text-green-600">{selectedRider.totalOrdersAccepted || 0}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Orders Accepted</p>
                                                    </div>
                                                    <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                                        <p className="text-2xl font-bold text-blue-600">{selectedRider.totalOrdersDelivered || 0}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Delivered</p>
                                                    </div>
                                                    <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                                        <p className="text-2xl font-bold text-red-600">{selectedRider.totalOrdersCancelled || 0}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Cancelled</p>
                                                    </div>
                                                    <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                                        <p className="text-2xl font-bold text-yellow-500">{selectedRider.rating}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Location & Availability</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Current Location</p>
                                                    <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
                                                        <MapPin size={16} className="text-red-500" />
                                                        {selectedRider.currentLat && selectedRider.currentLng ? (
                                                            <span className="text-sm">{selectedRider.currentLat.toFixed(4)}, {selectedRider.currentLng.toFixed(4)}</span>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">Location not available</span>
                                                        )}
                                                    </div>
                                                    {selectedRider.lastLocationUpdate && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Last updated: {new Date(selectedRider.lastLocationUpdate).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Availability</p>
                                                    <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
                                                        {selectedRider.isAvailable ? (
                                                            <><CheckCircle size={16} className="text-green-500" /> Available</>
                                                        ) : (
                                                            <><XCircle size={16} className="text-red-500" /> Unavailable</>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Account Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Joined Date</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {new Date(selectedRider.createdAt || '').toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Last Updated</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {new Date(selectedRider.updatedAt || '').toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedRider.status !== 'pending' && (
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Account Actions</h3>
                                                <button
                                                    onClick={() => handleSuspend(selectedRider.id)}
                                                    className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <Ban size={18} /> Suspend Rider
                                                </button>
                                                <p className="text-xs text-gray-500 text-center mt-2">
                                                    Suspending will prevent the rider from accepting new orders.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB: ANALYTICS */}
                                {modalTab === 'analytics' && selectedRider.status !== 'pending' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <BarChart3 size={20} className="text-yellow-600" />
                                            <h3 className="font-bold text-gray-900 dark:text-white">Delivery Performance</h3>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                                <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Accepted</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{selectedRider.totalOrdersAccepted || 0}</p>
                                            </div>
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Completed</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{selectedRider.totalOrdersDelivered || 0}</p>
                                            </div>
                                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                                <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Cancelled</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{selectedRider.totalOrdersCancelled || 0}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp size={16} className="text-purple-600" />
                                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase">Success Rate</p>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {selectedRider.totalOrdersAccepted
                                                        ? ((selectedRider.totalOrdersDelivered / selectedRider.totalOrdersAccepted) * 100).toFixed(1)
                                                        : 0}%
                                                </p>
                                            </div>
                                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Star size={16} className="text-yellow-600" />
                                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase">Rating</p>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRider.rating}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: HISTORY */}
                                {modalTab === 'history' && selectedRider.status !== 'pending' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <History size={20} className="text-yellow-600" />
                                            <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                                        </div>
                                        <div className="text-center py-12 text-gray-500">
                                            <History size={48} className="mx-auto mb-4 opacity-30" />
                                            <p className="text-sm">Order history will be displayed here</p>
                                            <p className="text-xs mt-1">Integration coming soon</p>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: DOCS */}
                                {modalTab === 'docs' && (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <FileText size={20} className="text-yellow-600" />
                                                <h3 className="font-bold text-gray-900 dark:text-white">License / RC Document</h3>
                                            </div>
                                            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl relative overflow-hidden border border-gray-200 dark:border-gray-600">
                                                {selectedRider.licenseImage && selectedRider.licenseImage.length > 0 ? (
                                                    <Image
                                                        src={selectedRider.licenseImage[0]}
                                                        alt="License document"
                                                        fill
                                                        className="object-contain"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                                        <FileText size={48} className="mb-2 opacity-30" />
                                                        <p className="text-sm">No document uploaded</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className={`flex items-center gap-1 text-xs font-bold ${selectedRider.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {selectedRider.isVerified ? (
                                                        <><CheckCircle size={14} /> Verified</>
                                                    ) : (
                                                        <><Clock size={14} /> Pending Verification</>
                                                    )}
                                                </div>
                                                {selectedRider.licenseImage && selectedRider.licenseImage.length > 0 && (
                                                    <a
                                                        href={selectedRider.licenseImage[0]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        View Full Size
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">License Number</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedRider.licenseNumber || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Document Status</p>
                                                <p className={`text-sm font-bold ${selectedRider.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {selectedRider.isVerified ? 'Verified' : 'Under Review'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}