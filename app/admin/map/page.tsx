"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AdminService } from "@/services/adminService";
import {
    Store,
    Bike,
    Layers,
    Search,
    Loader2,
    X,
    ChevronDown,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import Image from 'next/image';
// Dynamic import for MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

// Fix for default marker icons in Next.js (not needed with custom icons)

interface MapData {
    shops: any[];
    orders: any[];
    summary?: {
        totalActiveShops: number;
        totalActiveOrders: number;
    };
}

export default function LiveMapPage() {
    const [data, setData] = useState<MapData>({ shops: [], orders: [] });
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null);

    const [filters, setFilters] = useState({
        shops: true,
        orders: true,
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedShop, setExpandedShop] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
        // Load Leaflet only on client to avoid window reference during SSR
        import('leaflet').then((mod) => setLeaflet(mod)).catch((err) => {
            console.error('Failed to load leaflet', err);
        });
        fetchMapData();
        // Poll every 30 seconds
        const interval = setInterval(fetchMapData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMapData = async () => {
        try {
            const mapData = await AdminService.getGeoLocation();
            console.log(mapData)
            setData(mapData);
        } catch (error) {
            console.error("Failed to fetch map data", error);
        } finally {
            setLoading(false);
        }
    };



    // Nagoya/Default Center
    const defaultCenter: [number, number] = [21.1458, 79.0882];

    if (!isClient) return <div className="h-screen bg-gray-100 dark:bg-gray-900" />;

    // Filter to only include items with valid coordinates
    const validShops = data.shops.filter(shop =>
        shop.latitude && shop.longitude &&
        !isNaN(shop.latitude) && !isNaN(shop.longitude)
    );
    const validOrders = data.orders.filter(order =>
        order.latitude && order.longitude &&
        !isNaN(order.latitude) && !isNaN(order.longitude)
    );

    const displayShops = filters.shops ? validShops : [];
    const displayOrders = filters.orders ? validOrders : [];

    // Create icons only when leaflet is available
    const createIcons = () => {
        if (!leaflet) return { shopIcon: null, riderIcon: null };
        return {
            shopIcon: new leaflet.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [35, 55],
                iconAnchor: [17, 55],
                popupAnchor: [1, -45],
                shadowSize: [55, 55],
                shadowAnchor: [15, 55]
            }),
            riderIcon: new leaflet.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [35, 55],
                iconAnchor: [17, 55],
                popupAnchor: [1, -45],
                shadowSize: [55, 55],
                shadowAnchor: [15, 55]
            })
        };
    };

    const { shopIcon, riderIcon } = createIcons();

    return (
        <div className="h-[calc(100vh-4rem)] relative bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">

            {/* Sidebar */}
            <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-[999] transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-4 space-y-4">
                    {/* Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                        <X size={20} />
                    </button>

                    {/* Shops Section */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Store size={18} /> Shops ({validShops.length})
                        </h3>
                        <div className="space-y-2">
                            {validShops.map((shop) => (
                                <div key={`shop-list-${shop.id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setExpandedShop(expandedShop === `shop-${shop.id}` ? null : `shop-${shop.id}`)}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                                    >
                                        <div className="text-left">
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{shop.name}</p>
                                            <p className="text-xs text-gray-500">ID: {shop.id}</p>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${expandedShop === `shop-${shop.id}` ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {expandedShop === `shop-${shop.id}` && (
                                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                                            {shop.category && (
                                                <p><span className="text-gray-600 dark:text-gray-400">Category:</span> <span className="capitalize">{shop.category}</span></p>
                                            )}
                                            <p><span className="text-gray-600 dark:text-gray-400">Location:</span> {shop.latitude}, {shop.longitude}</p>
                                            <span className="inline-block text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="space-y-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Bike size={18} /> Orders ({validOrders.length})
                        </h3>
                        <div className="space-y-2">
                            {validOrders.map((order) => (
                                <div key={`order-list-${order.orderId}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setExpandedOrder(expandedOrder === `order-${order.orderId}` ? null : `order-${order.orderId}`)}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                                    >
                                        <div className="text-left">
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">Order #{order.orderId}</p>
                                            <p className="text-xs text-gray-500">User: {order.userId}</p>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${expandedOrder === `order-${order.orderId}` ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {expandedOrder === `order-${order.orderId}` && (
                                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                                            {order.userName && <p><span className="text-gray-600 dark:text-gray-400">User:</span> {order.userName}</p>}
                                            <p><span className="text-gray-600 dark:text-gray-400">Location:</span> {order.latitude}, {order.longitude}</p>
                                            <span className={`inline-block text-[10px] px-2 py-1 rounded capitalize ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="absolute top-4 left-16 z-[1000] flex flex-col gap-3">
                {/* z-index high to be above Leaflet */}
                <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex gap-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Toggle List"
                    >
                        <Layers size={20} />
                    </button>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, shops: !prev.shops }))}
                        className={`p-2 rounded-lg transition-colors ${filters.shops ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Toggle Shops"
                    >
                        <Store size={20} />
                    </button>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, orders: !prev.orders }))}
                        className={`p-2 rounded-lg transition-colors ${filters.orders ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Toggle Orders"
                    >
                        <Bike size={20} />
                    </button>
                </div>

                {/* Legend */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-2 w-64">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Map Legend</h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Showing {displayShops.length} shops & {displayOrders.length} orders
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">

                            <Image src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                                alt="Shop Marker" width={20} height={32}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Shop Location</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
                                alt="Shop Marker" width={20} height={32}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Order/User Location</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative z-0 w-full h-full">
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                    </div>
                )}

                {!isClient || !leaflet ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <Loader2 className="animate-spin" size={32} />
                    </div>
                ) : (
                    <MapContainer
                        key="map-container"
                        center={defaultCenter}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {displayShops.length === 0 && displayOrders.length === 0 && !loading && (
                            <div className="leaflet-bottom leaflet-right m-4 p-4 bg-white rounded shadow text-sm">
                                No active entities found with location data.
                            </div>
                        )}

                        {displayShops.map((shop) => (
                            <Marker
                                key={`shop-${shop.id}`}
                                position={[shop.latitude, shop.longitude]}
                                icon={shopIcon || undefined}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                    <div className="text-xs">
                                        <div className="font-bold">{shop.name}</div>
                                        <div className="text-gray-600">Shop ID: {shop.id}</div>
                                    </div>
                                </Tooltip>
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold text-sm">{shop.name}</h3>
                                        <p className="text-xs text-gray-500">Shop ID: {shop.id}</p>
                                        {shop.category && <p className="text-xs text-gray-500 capitalize">Category: {shop.category}</p>}
                                        <span className="inline-block text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1">Active Shop</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {displayOrders.map((order) => (
                            <Marker
                                key={`order-${order.orderId}`}
                                position={[order.latitude, order.longitude]}
                                icon={riderIcon || undefined}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                    <div className="text-xs">
                                        <div className="font-bold">Order #{order.orderId}</div>
                                        <div className="text-gray-600">{order.orderStatus}</div>
                                    </div>
                                </Tooltip>
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold text-sm">Order #{order.orderId}</h3>
                                        <p className="text-xs text-gray-500">User ID: {order.userId}</p>
                                        {order.userName && <p className="text-xs text-gray-500">User: {order.userName}</p>}
                                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
}