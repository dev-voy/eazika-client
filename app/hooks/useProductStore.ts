"use client";

import { useState, useEffect } from 'react';
import { products as initialProducts } from '@/app/data/mockData';

// Define the Product type based on your data structure
type Product = typeof initialProducts[0];

// This is our custom hook that all pages will use
export const useProductStore = () => {
    // 1. Always start with the default state to ensure server and client match initially.
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isInitialized, setIsInitialized] = useState(false);

    // 2. Use an effect to load from localStorage ONLY on the client, after the first render.
    useEffect(() => {
        try {
            const storedLikes = localStorage.getItem('productLikes');
            if (storedLikes) {
                const likedIds = new Set(JSON.parse(storedLikes));
                setProducts(currentProducts => 
                    currentProducts.map(product => ({
                        ...product,
                        liked: likedIds.has(product.id),
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to parse product likes from localStorage", error);
        }
        // Mark state as initialized from client-side storage
        setIsInitialized(true);
    }, []); // Empty dependency array means this runs only once on mount

    // 3. Use a separate effect to save to localStorage whenever products change,
    //    but only after the initial state has been loaded.
    useEffect(() => {
        if (!isInitialized) {
            return; // Don't save to localStorage on the initial server render
        }
        try {
            const likedIds = products.filter(p => p.liked).map(p => p.id);
            localStorage.setItem('productLikes', JSON.stringify(likedIds));
        } catch (error) {
            console.error("Failed to save product likes to localStorage", error);
        }
    }, [products, isInitialized]);

    // This is the function all components will call to toggle a like
    const handleLikeToggle = (productId: number) => {
        setProducts(currentProducts =>
            currentProducts.map(p =>
                p.id === productId ? { ...p, liked: !p.liked } : p
            )
        );
    };

    return { products, handleLikeToggle };
};

