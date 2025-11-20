"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Plus,
    Boxes,
    Edit, 
    X,
    Package,
    ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast'; 

// --- Mock Data (Self-Contained) ---
type MockProduct = {
    id: string;
    name: string;
    price: string;
    stock: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
};

const allShopProducts: MockProduct[] = [
    {
        id: 'PROD101',
        name: 'Lays Potato Chips - Classic',
        price: '$3.50',
        stock: 150,
        category: 'Snacks',
        imageUrl: 'https://placehold.co/150x150/FEF9C3/FDE047?text=Chips',
        inStock: true,
    },
    {
        id: 'PROD102',
        name: 'Coca-Cola Can - 330ml',
        price: '$1.50',
        stock: 200,
        category: 'Beverages',
        imageUrl: 'https://placehold.co/150x150/FEE2E2/F87171?text=Coke',
        inStock: true,
    },
    {
        id: 'PROD103',
        name: 'Cadbury Dairy Milk - Large',
        price: '$2.80',
        stock: 120,
        category: 'Snacks',
        imageUrl: 'https://placehold.co/150x150/E0E7FF/A5B4FC?text=Chocolate',
        inStock: true,
    },
    {
        id: 'PROD104',
        name: 'Nivea Body Cream',
        price: '$6.80',
        stock: 0,
        category: 'Personal Care',
        imageUrl: 'https://placehold.co/150x150/D1FAE5/6EE7B7?text=Cream',
        inStock: false,
    },
    {
        id: 'PROD105',
        name: 'Whole Wheat Bread',
        price: '$4.20',
        stock: 50,
        category: 'Grocery',
        imageUrl: 'https://placehold.co/150x150/E9D5FF/C084FC?text=Bread',
        inStock: true,
    },
];
// --- End Mock Data ---

// --- Product Card Component (Mobile Optimized) ---
const ProductCard = ({ 
    product, 
    onToggleStock,
    onEditStock 
}: { 
    product: MockProduct, 
    onToggleStock: (id: string, newStatus: boolean) => void,
    onEditStock: (product: MockProduct) => void 
}) => {
    
    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        onToggleStock(product.id, !product.inStock);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEditStock(product);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden 
                       transition-all duration-300 hover:shadow-lg hover:border-yellow-400 dark:hover:border-yellow-500" 
        >
            <div className="relative w-full h-32">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/E5E7EB/9CA3AF?text=Image';
                    }}
                />
                <span className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-bold rounded-full shadow-sm 
                                ${product.inStock 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-red-500 text-white'}`}
                >
                    {product.inStock ? 'Available' : 'Out'}
                </span>
            </div>
            
            <div className="p-4 space-y-3">
                <h3 className="font-bold text-gray-800 dark:text-white truncate">{product.name}</h3>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{product.category} | ID: {product.id}</p>
                
                <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white">{product.price}</span>
                    
                    {/* Stock Quantity and Edit Button */}
                    <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-200">
                            {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                        </span>
                        <button
                            onClick={handleEditClick}
                            className="p-1 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            aria-label="Edit stock quantity"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                {/* Toggler (Made full width on mobile if needed) */}
                <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Online Visibility:</span>
                    <div 
                        onClick={handleToggle}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            product.inStock ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={product.inStock}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                product.inStock ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
// --- End Product Card ---


// --- Stock Update Modal ---
const StockUpdateModal = ({ 
    product, 
    onSave, 
    onCancel 
}: { 
    product: MockProduct, 
    onSave: (productId: string, newStock: number) => void, 
    onCancel: () => void 
}) => {
    const [newStock, setNewStock] = useState(product.stock.toString());

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const stockValue = parseInt(newStock, 10);
        if (isNaN(stockValue) || stockValue < 0) {
            toast.error("Please enter a valid stock number (0 or more).");
            return;
        }
        onSave(product.id, stockValue);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl"
            >
                <form onSubmit={handleSave}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Update Stock</h2>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded-md" 
                            />
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id} | Current: {product.stock}</p>
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                New Stock Quantity
                            </label>
                            <input
                                type="number"
                                id="stock"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white shadow-inner"
                                placeholder="e.g., 150"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                        <button 
                            type="button"
                            onClick={onCancel} 
                            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-full text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-full text-center hover:bg-yellow-600 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};
// --- End Stock Update Modal ---


// --- Main Page Component ---
export default function ShopkeeperProductsPage() {
    const [products, setProducts] = useState(allShopProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [productToEditStock, setProductToEditStock] = useState<MockProduct | null>(null);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleToggleStock = (id: string, newStatus: boolean) => {
        setProducts(currentProducts =>
            currentProducts.map(p => 
                p.id === id 
                ? { ...p, inStock: newStatus, stock: newStatus ? (p.stock > 0 ? p.stock : 10) : 0 } 
                : p
            )
        );
        toast.success(newStatus ? 'Product visibility set to Online' : 'Product visibility set to Offline');
    };

    const handleUpdateStock = (productId: string, newStock: number) => {
        setProducts(currentProducts =>
            currentProducts.map(p =>
                p.id === productId ? { ...p, stock: newStock, inStock: newStock > 0 } : p
            )
        );
        setProductToEditStock(null);
        toast.success('Stock quantity updated!');
    };

    const handleAddNew = () => {
        if (typeof window !== 'undefined' && (window as any).setMockPathname) {
             (window as any).setMockPathname('/dashboard/inventory/new');
        } else {
             window.location.href = '/dashboard/inventory/new';
        }
    };

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header (Slim Mobile Style) */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management 📦</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Quickly view and update stock levels.</p>
            </div>

            {/* Search & Add New (Full Width Stack on Mobile) */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative grow">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Product Name, ID, or Category..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
                    />
                </div>
                {/* Made button full width on mobile for touch target size */}
                <button
                    onClick={handleAddNew}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 text-gray-900 font-bold rounded-full hover:bg-yellow-600 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add New 
                </button>
            </div>

            {/* Product List (Single column on mobile) */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onToggleStock={handleToggleStock} 
                            onEditStock={setProductToEditStock} 
                        />
                    ))
                    ) : (
                    <motion.div
                        key="no-products"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-10 sm:col-span-2 lg:col-span-3"
                    >
                        <Boxes className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
                            {searchTerm ? 'No Products Found' : 'Your Inventory is Empty'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {searchTerm ? 'Try a different search term.' : 'Click "Add New" to get started.'}
                        </p>
                    </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Render the modal */}
            <AnimatePresence>
                {productToEditStock && (
                    <StockUpdateModal
                        product={productToEditStock}
                        onSave={handleUpdateStock}
                        onCancel={() => setProductToEditStock(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}