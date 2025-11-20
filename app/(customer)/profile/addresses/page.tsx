"use client";

import React, { useState } from 'react';
// import Link from 'next/link'; // Replaced with <a> tag to avoid build errors
// import MainLayout from '@/app/components/MainLayout'; // Removed, as layout is handled by app/(customer)/layout.tsx
// import { ArrowLeftIcon } from '@/app/components/Icons'; // Replaced with Lucide icon
import { 
    MapPin, 
    Edit, 
    Trash2, 
    Home, 
    Briefcase, 
    AlertTriangle, 
    LocateFixed, 
    Plus, 
    ArrowLeft // Added Lucide icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type Definitions and Mock Data ---
type Address = {
    id: number;
    type: 'Home' | 'Work';
    details: string;
    isDefault: boolean;
};

const initialAddresses: Address[] = [
    { id: 1, type: 'Home', details: '123 Main Street, Anytown, USA 12345', isDefault: true },
    { id: 2, type: 'Work', details: '456 Business Ave, Suite 500, Workville, USA 67890', isDefault: false },
];

// --- Confirmation Modal for Deletion ---
const DeleteConfirmationModal = ({ address, onConfirm, onCancel }: { address: Address, onConfirm: () => void, onCancel: () => void }) => (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
    >
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl p-6 text-center"
        >
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-2 rounded-full" />
            <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Delete Address?</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400"> Are you sure you want to delete your &quot;{address.type}&quot; address? This action cannot be undone.</p>
            <div className="flex gap-4 mt-6">
                <button 
                    onClick={onCancel} 
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm} 
                    className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                >
                    Delete
                </button>
            </div>
        </motion.div>
    </motion.div>
);

// --- Form for Adding/Editing Addresses ---
const AddressForm = ({ addressToEdit, onSave, onCancel }: { addressToEdit: Partial<Address>, onSave: (address: Omit<Address, 'id'> | Address) => void, onCancel: () => void }) => {
    const [type, setType] = useState<'Home' | 'Work'>(addressToEdit.type || 'Home');
    const [details, setDetails] = useState(addressToEdit.details || '');
    const [isDefault, setIsDefault] = useState(addressToEdit.isDefault || false);
    const isEditing = !!addressToEdit.id;

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // In a real app, you would use a reverse geocoding service here.
                    // For this demo, we'll just fill in the coordinates.
                    setDetails(`Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`);
                },
                () => {
                    // Replaced alert with a more modern notification if possible, but alert is fine
                    alert("Could not get your location. Please check your browser permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!details) return;
        const newAddress = { ...addressToEdit, type, details, isDefault };
        onSave(newAddress);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 max-w-lg mx-auto"
        >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address Type</label>
                    <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => setType('Home')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${type === 'Home' ? 'bg-yellow-50 border-yellow-500 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300' : 'bg-gray-100 border-transparent text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}><Home className="w-4 h-4" /> Home</button>
                        <button type="button" onClick={() => setType('Work')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${type === 'Work' ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' : 'bg-gray-100 border-transparent text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}><Briefcase className="w-4 h-4" /> Work</button>
                    </div>
                </div>
                <div>
                    <label htmlFor="details" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Address</label>
                    <div className="relative mt-1">
                        <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. 123 Main Street, Anytown, USA 12345" className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white" rows={3}/>
                        <button type="button" onClick={handleUseCurrentLocation} className="absolute top-2 right-2 p-2 text-gray-500 hover:text-yellow-500 transition-colors" title="Use my current location">
                            <LocateFixed className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center">
                    <input id="isDefault" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="h-5 w-5 text-yellow-600 border-gray-300 dark:border-gray-600 rounded focus:ring-yellow-500" />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Set as default address</label>
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-full text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                    <button type="submit" className="w-full bg-yellow-400 text-gray-800 font-bold py-3 rounded-full text-center hover:bg-yellow-500 transition-colors">Save Address</button>
                </div>
            </form>
        </motion.div>
    );
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
    const [addressToEdit, setAddressToEdit] = useState<Partial<Address> | null>(null);
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

    const handleSaveAddress = (address: Omit<Address, 'id'> | Address) => {
        let newAddresses: Address[] = [];
        
        if ('id' in address) {
            // This is an edit
            newAddresses = addresses.map(a => a.id === address.id ? address : a);
        } else {
            // This is a new address
            newAddresses = [...addresses, { ...address, id: Date.now() }];
        }

        // If the new/edited address is set as default, unset all others
        if (address.isDefault) {
            newAddresses = newAddresses.map(a => 
                a.id === ('id' in address ? address.id : newAddresses[newAddresses.length - 1].id)
                    ? { ...a, isDefault: true }
                    : { ...a, isDefault: false }
            );
        }

        setAddresses(newAddresses);
        setAddressToEdit(null);
    };

    const handleConfirmDelete = () => {
        if (addressToDelete) {
            setAddresses(current => current.filter(a => a.id !== addressToDelete.id));
            setAddressToDelete(null);
        }
    };

    return (
        // <MainLayout> // Removed, as layout is handled by app/(customer)/layout.tsx
        <>
            <div className="w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
                <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
                    {/* Replaced Link with a tag */}
                    <a href="/profile" aria-label="Go back to profile">
                        <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                    </a>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Delivery Addresses</h1>
                </header>
                <main className="flex-grow overflow-y-auto p-4 md:p-6">
                    <AnimatePresence mode="wait">
                        {addressToEdit ? (
                            <AddressForm key="form" addressToEdit={addressToEdit} onSave={handleSaveAddress} onCancel={() => setAddressToEdit(null)} />
                        ) : (
                            <motion.div key="list" className="space-y-4 max-w-lg mx-auto">
                                {addresses.map((address, index) => (
                                    <motion.div 
                                        key={address.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 flex justify-between items-start"
                                    >
                                        <div className="flex gap-4">
                                            <MapPin className="w-6 h-6 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-800 dark:text-white">{address.type}</h3>
                                                    {address.isDefault && <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">Default</span>}
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">{address.details}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0 ml-2">
                                            <button onClick={() => setAddressToEdit(address)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => setAddressToDelete(address)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </motion.div>
                                ))}
                                {/* "Add New" button at the bottom of the list */}
                                {addresses.length > 0 && (
                                    <motion.button 
                                        onClick={() => setAddressToEdit({})} 
                                        className="w-full flex items-center justify-center gap-2 py-3 font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    >
                                        <Plus className="w-5 h-5"/> Add New Address
                                    </motion.button>
                                )}
                                {/* Centered "Add New" button for the empty state */}
                                {addresses.length === 0 && (
                                    <div className="text-center py-20">
                                        <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">No addresses yet</h2>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Add your first delivery address to get started.</p>
                                        <button onClick={() => setAddressToEdit({})} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-yellow-600 transition-colors">
                                            <Plus className="w-5 h-5"/> Add Your First Address
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
            <AnimatePresence>
                {addressToDelete && (
                    <DeleteConfirmationModal 
                        address={addressToDelete} 
                        onConfirm={handleConfirmDelete} 
                        onCancel={() => setAddressToDelete(null)} 
                    />
                )}
            </AnimatePresence>
        </>
        // </MainLayout> // Removed
    );
}