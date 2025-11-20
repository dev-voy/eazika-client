"use client";

import React, { useState, ReactNode, useEffect, useRef } from 'react';
// import { usePathname } from 'next/navigation'; // UNCOMMENT in your project
// import { useTheme } from 'next-themes'; // UNCOMMENT in your project
import { 
    LayoutGrid, 
    Package, 
    NotebookText, 
    CircleDollarSign, 
    User, 
    Sun, 
    Moon, 
    MessageCircle,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- Mock Hooks (for context continuity) ---
const usePathname = () => {
    const [pathname, setPathname] = useState(typeof window !== 'undefined' ? window.location.pathname : "/dashboard"); 

    useEffect(() => {
        const updatePath = () => setPathname(window.location.pathname);
        
        window.addEventListener('popstate', updatePath);
        
        if (typeof window !== 'undefined') {
            (window as any).setMockPathname = (newPath: string) => {
                window.history.pushState({}, '', newPath);
                updatePath();
            };
        }

        updatePath();

        return () => {
            window.removeEventListener('popstate', updatePath);
        };
    }, []);
    return pathname;
};

/**
 * --- THEME PERSISTENCE HOOK ---
 * Reads/writes theme preference to localStorage.
 */
const useTheme = () => {
    // 1. Initialize state by reading from localStorage on mount
    const [theme, setThemeState] = useState<string>(() => {
        if (typeof window === 'undefined') {
            return 'light'; // Default for server-side render
        }
        
        const storedTheme = localStorage.getItem('app-theme');
        // Ensure that we return a valid string, defaulting to 'light'
        return storedTheme === 'dark' ? 'dark' : 'light'; 
    });

    // 2. useEffect to sync theme to DOM and localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = document.documentElement;
            
            // Sync DOM class
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            
            // Save preference to localStorage
            localStorage.setItem('app-theme', theme);
        }
    }, [theme]);

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
    };

    return { 
        theme, 
        setTheme 
    };
};


// --- 1. Shopkeeper Header ---
const ShopkeeperHeader = () => {
    const { theme, setTheme } = useTheme();
    
    // --- FIX: Store initial status in ref and state
    const initialStatus = true; // Default to online
    const [isOnline, setIsOnline] = useState(initialStatus);
    const isInitialMount = useRef(true); 

    // This effect runs only when isOnline changes *after* the initial render
    useEffect(() => {
        // Skip toast on initial load
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Show toast only on manual toggle
        if (isOnline) {
            toast.success("You are now Online", { 
                position: "top-center", 
                icon: <CheckCircle className="w-5 h-5 text-green-500" />
            });
        } else {
            toast.error("You are now Offline", { 
                position: "top-center",
                icon: <AlertCircle className="w-5 h-5 text-red-500" />
            });
        }
    }, [isOnline]); // Reruns when isOnline changes

    const handleOnlineToggle = () => {
        setIsOnline(prev => !prev); 
    };

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 sm:px-6 md:px-8">
            {/* Online/Offline Toggle */}
            <div className="flex items-center gap-2">
                <div 
                    onClick={handleOnlineToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isOnline ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
                    {isOnline ? "Online" : "Offline"}
                </span>
            </div>

            <div className="flex-1"></div> {/* Spacer */}

            {/* Theme & Chat Buttons */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                
                <a 
                    href="/chat/[id]" // Example chat link
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                    <MessageCircle className="h-5 w-5" />
                </a>
            </div>
        </header>
    );
};

// --- 2. Navigation Links ---
const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Orders", href: "/dashboard/orders", icon: Package },
    { name: "Inventory", href: "/dashboard/inventory", icon: NotebookText },
    { name: "Earning", href: "/dashboard/earning", icon: CircleDollarSign },
    { name: "Profile", href: "/dashboard/profile", icon: User },
];

const NavItem = ({ href, icon: Icon, name, isActive }: { href: string, icon: React.ElementType, name: string, isActive: boolean }) => (
    <a
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            isActive 
            ? 'bg-yellow-400 text-gray-900 font-bold' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
    >
        <Icon className="h-4 w-4" />
        {name}
    </a>
);

// --- 3. Desktop Sidebar ---
const DesktopSidebar = () => {
    const pathname = usePathname();
    return (
        <aside className="hidden md:block w-64 border-r bg-white dark:bg-gray-800">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <a href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <CheckCircle className="h-6 w-6 text-yellow-500" />
                        <span className="text-gray-900 dark:text-white">Eazika Shop</span>
                    </a>
                </div>
                <nav className="flex-1 overflow-auto py-4 px-4">
                    <div className="grid items-start gap-1">
                        {navLinks.map((link) => (
                            <NavItem 
                                key={link.name}
                                {...link}
                                isActive={pathname === link.href}
                            />
                        ))}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

// --- 4. Mobile Bottom Navigation ---
const ShopkeeperBottomNav = () => {
    const pathname = usePathname();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 border-t bg-white dark:bg-gray-800 md:hidden">
            <div className="flex h-full items-center justify-around">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className={`flex flex-col items-center gap-1 p-2 ${
                            pathname === link.href 
                            ? 'text-yellow-500' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <link.icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{link.name}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
};

// --- 5. Main Shopkeeper Layout (Simplified) ---
export default function ShopkeeperLayout({ children }: { children: ReactNode }) {
    
    // --- FIX: Add hasMounted state to prevent hydration errors ---
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // This ensures the server and client render the same thing initially
    if (!hasMounted) {
        return null; 
    }
    // --- End of FIX ---

    return (
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* Added Toaster for notifications */}
            <Toaster />

            {/* Desktop Sidebar (visible on md screens and up) */}
            <DesktopSidebar />
            
            <div className="flex-1 flex flex-col">
                {/* Header (same for all sizes) */}
                <ShopkeeperHeader />
                
                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 sm:px-6 md:px-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation (hidden on md screens and up) */}
            <ShopkeeperBottomNav />
        </div>
    );
}