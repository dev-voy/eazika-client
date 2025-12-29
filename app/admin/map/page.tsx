"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AdminService } from "@/services/adminService";
import {
    Store,
    Bike,
    Layers,
    Search,
    Loader2
} from 'lucide-react';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import ShopService from '@/services/shopService';

// Dynamic import for MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

// Fix for default marker icons in Next.js (not needed with custom icons)

interface MapData {
    shops: any[];
    riders: any[];
}

interface ShopAddress {
    shopId: string;
    shopName: string;
    shopCategory?: string;
    address?: {
        phone?: string;
        geoLocation?: string;
    };
}

export default function LiveMapPage() {
    const [data, setData] = useState<MapData>({ shops: [], riders: [] });
    const [shopAddresses, setShopAddresses] = useState<ShopAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null);

    const [filters, setFilters] = useState({
        shops: true,
        riders: true,
    });

    useEffect(() => {
        setIsClient(true);
        // Load Leaflet only on client to avoid window reference during SSR
        import('leaflet').then((mod) => setLeaflet(mod)).catch((err) => {
            console.error('Failed to load leaflet', err);
        });
        fetchMapData();
        fetchShopAddresses();
        // Poll every 30 seconds
        const interval = setInterval(fetchMapData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMapData = async () => {
        try {
            const mapData = await AdminService.getLiveMapData();
            setData(mapData);
        } catch (error) {
            console.error("Failed to fetch map data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchShopAddresses = async () => {
        try {
            const addressData = await AdminService.getAllShopsAddress();
            setShopAddresses(addressData || []);
        } catch (error) {
            console.error("Failed to fetch shop addresses", error);
        }
    };

    // Parse geo location string "lat,lng" to [lat, lng]
    const parseGeoLocation = (geo?: string): [number, number] | null => {
        if (!geo || typeof geo !== 'string') return null;
        const parts = geo.split(',');
        if (parts.length !== 2) return null;
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (isNaN(lat) || isNaN(lng)) return null;
        return [lat, lng];
    };
    // Custom Icons logic would go here. For now, simple logic or default markers.
    // Since we can't easily import L on server side, we define icons inside the component or effect.

    // Nagoya/Default Center
    const defaultCenter: [number, number] = [21.1458, 79.0882];

    if (!isClient) return <div className="h-screen bg-gray-100 dark:bg-gray-900" />;

    const displayShops = filters.shops ? data.shops : [];
    const displayRiders = filters.riders ? data.riders : [];

    // Get shops with valid geo locations from shopAddresses
    const shopsWithGeo = shopAddresses
        .map(shop => {
            const position = parseGeoLocation(shop.address?.geoLocation);
            if (!position) return null;
            return {
                id: shop.shopId,
                name: shop.shopName,
                category: shop.shopCategory,
                phone: shop.address?.phone,
                position
            };
        })
        .filter((shop): shop is NonNullable<typeof shop> => shop !== null);

    // Custom marker icons - bigger and more visible
    const shopIcon = isClient && leaflet ? new leaflet.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [35, 55],
        iconAnchor: [17, 55],
        popupAnchor: [1, -45],
        shadowSize: [55, 55],
        shadowAnchor: [15, 55]
    }) : null;

    const riderIcon = isClient && leaflet ? new leaflet.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [35, 55],
        iconAnchor: [17, 55],
        popupAnchor: [1, -45],
        shadowSize: [55, 55],
        shadowAnchor: [15, 55]
    }) : null;

    // We need to construct icons on client side only to avoid 'window is not defined'
    // But let's rely on React-Leaflet's behavior. We will use simple circle markers or default markers if Icon import works.

    // Fallback for custom icons using DivIcon if we want consistent styling
    // For this step, to ensure it works immediately, I will use standard markers but maybe color them if possible, or just standard blue.
    // Ideally, distinct icons for Shops vs Riders.

    // Custom Icon Imports (Hack to make them work)
    // const shopIcon = new Icon({
    //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/3514/3514491.png', 
    //   iconSize: [32, 32]
    // });
    // const riderIcon = new Icon({
    //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png',
    //   iconSize: [32, 32]
    // });

    return (
        <div className="h-[calc(100vh-4rem)] relative bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">

            {/* Toolbar */}
            <div className="absolute top-4 left-16 z-[1000] flex flex-col gap-3">
                {/* z-index high to be above Leaflet */}
                <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex gap-2">
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, shops: !prev.shops }))}
                        className={`p-2 rounded-lg transition-colors ${filters.shops ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Toggle Shops"
                    >
                        <Store size={20} />
                    </button>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, riders: !prev.riders }))}
                        className={`p-2 rounded-lg transition-colors ${filters.riders ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Toggle Riders"
                    >
                        <Bike size={20} />
                    </button>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative z-0">
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                    </div>
                )}

                <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {shopsWithGeo.length === 0 && displayRiders.length === 0 && !loading && (
                        // Suggestion text if map is empty
                        <div className="leaflet-bottom leaflet-right m-4 p-4 bg-white rounded shadow text-sm">
                            No active entities found with location data.
                        </div>
                    )}

                    {/* Display shops from shopAddresses with geo location */}
                    {filters.shops && shopsWithGeo.map((shop) => (
                        <Marker
                            key={`shop-${shop.id}`}
                            position={shop.position}
                            icon={shopIcon || undefined}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                <div className="text-xs">
                                    <div className="font-bold">{shop.name}</div>
                                    <div className="text-gray-600">ID: {shop.id}</div>
                                </div>
                            </Tooltip>
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-sm">{shop.name}</h3>
                                    <p className="text-xs text-gray-500">ID: {shop.id}</p>
                                    {shop.category && <p className="text-xs text-gray-500 capitalize">{shop.category}</p>}
                                    {shop.phone && <p className="text-xs">{shop.phone}</p>}
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active Shop</span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {displayRiders.map((rider) => (
                        <Marker
                            key={`rider-${rider.id}`}
                            position={[rider.lat, rider.lng]}
                            icon={riderIcon || undefined}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                <div className="text-xs">
                                    <div className="font-bold">{rider.name}</div>
                                    <div className="text-gray-600">ID: {rider.id}</div>
                                </div>
                            </Tooltip>
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-sm">{rider.name}</h3>
                                    <p className="text-xs">{rider.phone}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${rider.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {rider.status}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </div>
    );
}