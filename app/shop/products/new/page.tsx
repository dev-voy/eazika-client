"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Package, 
    DollarSign, 
    Boxes,
    UploadCloud,
    List,
    Save,
    X // Added X for removing images
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock categories for the dropdown
const mockCategories = [
    "Snacks",
    "Beverages",
    "Grocery",
    "Personal Care",
    "Household",
    "Beauty & Wellness"
];

// --- Main Page Component ---
export default function AddNewProductPage() {
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState(mockCategories[0]);
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!productName || !category || !price || !stock) {
            toast.error("Please fill all required fields (Name, Category, Price, Stock).");
            return;
        }

        const newProduct = {
            name: productName,
            category,
            price: `$${parseFloat(price).toFixed(2)}`,
            stock: parseInt(stock, 10),
            description,
            imageUrl: imagePreview || 'https://placehold.co/150x150/E5E7EB/9CA3AF?text=No+Image'
        };

        console.log("New Product Submitted:", newProduct);
        toast.success("Product added successfully!");
        
        // Redirect back to inventory page
        setTimeout(() => {
            if (typeof window !== 'undefined' && (window as any).setMockPathname) {
                 (window as any).setMockPathname('/dashboard/inventory');
            } else {
                 window.location.href = '/dashboard/inventory';
            }
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div 
            className="max-w-lg mx-auto" // Adjusted max-width for better mobile centering
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6 pt-2">
                <a 
                    href="/dashboard/inventory"
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Back to Inventory"
                >
                    <ArrowLeft className="w-6 h-6" />
                </a>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product 📝</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Fill details for your new item.</p>
                </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-6"> {/* Unified column structure for mobile stack */}
                    
                    {/* Image Upload Block (Top in Mobile View) */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Product Image (Optional)
                        </label>
                        
                        {/* Image Display and Placeholder */}
                        <div className={`flex justify-center p-4 rounded-md overflow-hidden ${
                            imagePreview ? 'border border-gray-300 dark:border-gray-600' : 'border-2 border-dashed border-gray-300 dark:border-gray-600'
                        }`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Product preview" className="h-40 w-full object-contain rounded-lg" />
                            ) : (
                                <div className="space-y-2 text-center py-6">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tap below to select image</p>
                                </div>
                            )}
                        </div>

                        {/* Upload/Remove Controls */}
                        <div className="mt-4 flex items-center justify-between">
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer font-medium text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-500 focus-within:outline-none transition-colors"
                            >
                                <span>{imagePreview ? 'Change Image' : 'Select Image'}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                            </label>
                            
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => setImagePreview(null)}
                                    className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" /> Remove
                                </button>
                            )}
                        </div>
                    </motion.div>


                    {/* Product Details (Fields) */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                        
                        {/* Product Name (Required) */}
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-1">
                                <Package className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    id="productName"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                                    placeholder="e.g., Lays Potato Chips"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category (Required) */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-1">
                                <List className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white appearance-none shadow-inner"
                                    required
                                >
                                    {mockCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {/* Custom dropdown arrow */}
                                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Price & Stock (Stacked on mobile) */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Price (Required) */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        id="price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                                        placeholder="3.50"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Stock Quantity (Required) */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <Boxes className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        id="stock"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                                        placeholder="150"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description (Optional) */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description (Optional)
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                                    placeholder="Add a short description for the product..."
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Form Actions (Full Width on Mobile) */}
                <motion.div variants={itemVariants} className="flex flex-col gap-4 pt-4">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors shadow-md"
                    >
                        <Save className="w-5 h-5" />
                        Save Product
                    </button>
                     <a
                        href="/dashboard/inventory"
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </a>
                </motion.div>
            </form>
        </motion.div>
    );
}