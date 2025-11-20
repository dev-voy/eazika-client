"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, CreditCard, Landmark, Truck, PlusIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddressStore } from '@/app/hooks/useAddressStore';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useCartStore } from '@/app/hooks/useCartStore'; // Import cart store

const STEPS = ["Shipping Address", "Payment Method"];
type PaymentType = 'cod' | 'debit' | 'upi' | null;

// --- Mock Saved Card Data ---
interface SavedCard {
    id: number;
    brand: string;
    last4: string;
    image: string;
    holderName: string; // Added holder name
}
const mockSavedCards: SavedCard[] = [
    { id: 1, brand: 'Mastercard', last4: '3156', image: '/assests/images/CARD1.jpeg', holderName: 'Customer Name' },
    { id: 2, brand: 'Visa', last4: '1234', image: '/assests/images/CARD2.jpeg', holderName: 'Another Name' },
];
// --- End Mock Data ---


export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const { addAddress } = useAddressStore();
    const { clearCart } = useCartStore(); // Get clearCart function

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- Address Form State ---
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [saveAddress, setSaveAddress] = useState(true);

    // --- Payment State ---
    const [selectedPayment, setSelectedPayment] = useState<PaymentType>('upi');
    const [selectedCardId, setSelectedCardId] = useState<number | null>(mockSavedCards[0]?.id ?? null); // Default to first card if exists
    const [cardName, setCardName] = useState(mockSavedCards[0]?.holderName ?? ""); // Pre-fill with selected card name
    const [cardNumber, setCardNumber] = useState(""); // Keep separate for new card entry
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardCountry, setCardCountry] = useState("");
    const [upiId, setUpiId] = useState("");
    const [saveCard, setSaveCard] = useState(true);

    // Update card name when selected card changes
    useEffect(() => {
        if (selectedPayment === 'debit' && selectedCardId) {
            const selectedCard = mockSavedCards.find(card => card.id === selectedCardId);
            setCardName(selectedCard?.holderName || "");
            // Clear other fields when selecting a saved card (optional)
            setCardNumber("");
            setCardExpiry("");
            setCardCvv("");
            setCardCountry("");
        }
    }, [selectedCardId, selectedPayment]);


    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email || !phone || !address || !zipCode || !city || !country) {
            toast.error("Please fill in all address fields.");
            return;
        }
        const newAddressData = { fullName, email, phone, address, zipCode, city, country };
        if (saveAddress) {
            addAddress(newAddressData);
            toast.success("Address saved!");
        }
        setCurrentStep(1);
    };

     const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPayment) {
            toast.error("Please select a payment method.");
            return;
        }

        let paymentDetails = {};
        if (selectedPayment === 'debit') {
            const selectedCard = mockSavedCards.find(card => card.id === selectedCardId);
            if (selectedCard) {
                 paymentDetails = { type: 'debit', savedCardId: selectedCard.id };
                 if(!cardName) {
                    toast.error("Card holder name is required.");
                    return;
                 }
                 paymentDetails = { ...paymentDetails, cardName };

            } else {
                 if (!cardName || !cardNumber || !cardExpiry || !cardCvv || !cardCountry) {
                    toast.error("Please fill in all new card details.");
                    return;
                 }
                 paymentDetails = { type: 'debit', cardName, cardNumber, cardExpiry, cardCvv, cardCountry, saveCard };
            }

        } else if (selectedPayment === 'upi') {
             if (!upiId) {
                toast.error("Please enter your UPI ID.");
                return;
             }
            paymentDetails = { type: 'upi', upiId };
        } else { // COD
            paymentDetails = { type: 'cod' };
        }

        console.log("Placing Order with:", paymentDetails);
        // TODO: Integrate actual payment processing and order placement logic
        
        // --- Simulate order placement ---
        // For now, just show a success message, clear the cart, and redirect
        clearCart(); // Clear the shopping cart
        toast.success("Order Placed Successfully!"); 
        
        // --- Redirect to Track Order page ---
        router.push('/track-order'); // Changed from '/home'
    };

    const handleStepClick = (index: number) => {
        if (index === 0 && currentStep === 1) {
             if (!fullName || !email || !phone || !address || !zipCode || !city || !country) {
                 toast.error("Please complete the shipping address first.");
                 return;
             }
            setCurrentStep(0);
        }
    };

    // Handler for selecting a saved card
    const handleCardSelection = (cardId: number) => {
        setSelectedCardId(cardId);
        setCardNumber("");
        setCardExpiry("");
        setCardCvv("");
        setCardCountry("");
        setSaveCard(false); 
    };

    // Handler for when user starts typing in new card fields
    const handleNewCardInput = () => {
        setSelectedCardId(null); 
    };

    if (!isClient) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-gray-950"><p className="dark:text-white">Loading...</p></div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto bg-gray-100 dark:bg-gray-950 min-h-screen flex flex-col">
            <Toaster position="bottom-center" />
            {/* Header */}
            <header className="px-4 md:px-6 py-4 flex items-center space-x-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20 shrink-0">
                <button
                    onClick={() => {
                        if (currentStep === 1) setCurrentStep(0);
                        else router.back();
                    }}
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Checkout</h1>
            </header>

            {/* Step Indicator */}
            <div className="p-4 md:p-6 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
                <div className="flex items-center justify-between max-w-md mx-auto relative mb-2">
                    {STEPS.map((step, index) => (
                        <button
                            key={step}
                            onClick={() => handleStepClick(index)}
                            disabled={index > currentStep || (index < currentStep && currentStep === 0) }
                            className={`flex flex-col items-center z-10 w-1/2 ${index < currentStep ? 'cursor-pointer' : (index === currentStep ? 'cursor-default' : 'cursor-not-allowed')}`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${index <= currentStep ? 'bg-yellow-500 border-yellow-500' : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                                {index < currentStep && <Check size={14} className="text-white" />}
                                {index === currentStep && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className={`text-xs mt-1 font-semibold transition-colors ${index <= currentStep ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{step}</span>
                        </button>
                    ))}
                    <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 w-full -z-10">
                       <motion.div
                         className="h-full bg-yellow-500"
                         initial={{ width: '0%' }}
                         animate={{ width: currentStep === 0 ? '0%' : '100%' }}
                         transition={{ duration: 0.3 }}
                       />
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <main className="grow overflow-y-auto p-4 md:p-6">
                <div className="max-w-md mx-auto space-y-4">
                   <AnimatePresence mode="wait">
                        {/* Shipping Address Form */}
                        {currentStep === 0 && (
                            <motion.form
                              onSubmit={handleAddressSubmit}
                              key="shipping-step"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-4"
                            >
                                {/* Address Form fields... */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                    <input type="text" placeholder="Type your home address" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip Code</label>
                                        <input type="text" placeholder="Enter here" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                        <input type="text" placeholder="Enter here" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                    <select value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none">
                                        <option value="" disabled>Choose your country</option>
                                        <option value="IN">India</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-2">
                                    <input id="save-address" type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"/>
                                    <label htmlFor="save-address" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                        Save shipping address
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-yellow-400 text-gray-900 font-bold py-4 rounded-full text-center hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-400/30 mt-6"
                                >
                                    NEXT
                                </button>
                            </motion.form>
                        )}

                        {/* Payment Method Section */}
                        {currentStep === 1 && (
                             <motion.form
                                onSubmit={handlePaymentSubmit}
                                key="payment-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Payment Options - Reordered */}
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    <button type="button" onClick={() => setSelectedPayment('upi')} className={`px-5 py-3 rounded-full border-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${ selectedPayment === 'upi' ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500 text-yellow-700 dark:text-yellow-300 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500' }`}>
                                        <Landmark size={16}/> UPI
                                    </button>
                                     <button type="button" onClick={() => setSelectedPayment('cod')} className={`px-5 py-3 rounded-full border-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${ selectedPayment === 'cod' ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500 text-yellow-700 dark:text-yellow-300 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500' }`}>
                                       <Truck size={16} /> Cash on Delivery
                                    </button>
                                    <button type="button" onClick={() => setSelectedPayment('debit')} className={`px-5 py-3 rounded-full border-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${ selectedPayment === 'debit' ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500 text-yellow-700 dark:text-yellow-300 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500' }`}>
                                        <CreditCard size={16}/> Debit Card
                                    </button>
                                </div>

                                {/* Conditional Forms */}
                                <AnimatePresence mode="wait">
                                    {selectedPayment === 'debit' && (
                                        <motion.div
                                            key="card-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4 overflow-hidden pt-6"
                                        >
                                            {/* --- Functional Saved Cards --- */}
                                            {mockSavedCards.length > 0 && (
                                                <div className="flex space-x-4 overflow-x-auto pb-4">
                                                    {mockSavedCards.map((card) => (
                                                        <div
                                                            key={card.id}
                                                            onClick={() => handleCardSelection(card.id)}
                                                            className={`relative shrink-0 cursor-pointer transition-all duration-200 ${selectedCardId === card.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                                        >
                                                            <Image
                                                                src={card.image}
                                                                alt={`${card.brand} ending in ${card.last4}`}
                                                                width={160}
                                                                height={100}
                                                                className={`rounded-lg shadow-md border-2 ${selectedCardId === card.id ? 'border-yellow-500' : 'border-gray-300 dark:border-gray-600'}`}
                                                            />
                                                            {selectedCardId === card.id && (
                                                                <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow">
                                                                    <Check size={12} className="text-yellow-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                     {/* Add New Card Button */}
                                                     <button
                                                        type="button"
                                                        onClick={() => setSelectedCardId(null)} // Deselect to show new card form
                                                        className={`shrink-0 w-40 h-[100px] flex flex-col items-center justify-center rounded-lg border-2 transition-colors duration-200 ${selectedCardId === null ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
                                                    >
                                                        <PlusIcon className={`w-6 h-6 mb-1 ${selectedCardId === null ? 'text-yellow-600' : 'text-gray-500 dark:text-gray-400'}`} />
                                                        <span className={`text-xs font-semibold ${selectedCardId === null ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-300'}`}>Add New Card</span>
                                                    </button>
                                                </div>
                                            )}
                                            {/* --- End Functional Saved Cards --- */}

                                            {/* Conditionally show fields only if adding a new card */}
                                            <AnimatePresence>
                                            {selectedCardId === null && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 overflow-hidden pt-4 border-t dark:border-gray-700"
                                                >
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Holder Name</label>
                                                        <input type="text" placeholder="Customer Name" value={cardName} onChange={(e) => { setCardName(e.target.value); handleNewCardInput(); }} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                                                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value); handleNewCardInput(); }} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm" />
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month/Year</label>
                                                            <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={(e) => { setCardExpiry(e.target.value); handleNewCardInput(); }} className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                                                            <input type="text" placeholder="XXX" value={cardCvv} onChange={(e) => { setCardCvv(e.target.value); handleNewCardInput(); }} className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                                        <select value={cardCountry} onChange={(e) => { setCardCountry(e.target.value); handleNewCardInput(); }} required className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none">
                                                            <option value="" disabled>Choose your country</option>
                                                            <option value="IN">India</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center pt-2">
                                                        <input id="save-card" type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"/>
                                                        <label htmlFor="save-card" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                                            Save debit card details
                                                        </label>
                                                    </div>
                                                </motion.div>
                                            )}
                                            </AnimatePresence>
                                            {/* Show cardholder name even if using saved card and new card form is hidden */}
                                            {selectedCardId !== null && (
                                                 <div className="pt-4">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Holder Name (Selected Card)</label>
                                                    <input type="text" readOnly value={cardName} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm cursor-not-allowed" />
                                                 </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {selectedPayment === 'upi' && (
                                        <motion.div
                                            key="upi-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-4 overflow-hidden pt-6 border-t dark:border-gray-700"
                                        >
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter UPI ID</label>
                                            <input
                                                type="text"
                                                placeholder="yourname@bank"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            />
                                        </motion.div>
                                    )}

                                    {selectedPayment === 'cod' && (
                                         <motion.div
                                            key="cod-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden pt-6 border-t dark:border-gray-700 text-center"
                                        >
                                            <p className="text-gray-600 dark:text-gray-400">You can pay with cash when your order is delivered.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Common Buttons for Payment Step */}
                                 <button
                                    type="submit"
                                    disabled={!selectedPayment}
                                    className="w-full bg-yellow-400 text-gray-900 font-bold py-4 rounded-full text-center hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-400/30 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    CONFIRM ORDER
                                </button>
                            </motion.form>
                        )}
                   </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

