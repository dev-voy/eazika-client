"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDeliveryStore } from "@/hooks/useDeliveryStore";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { toast } from "sonner";

type LatLng = { lat: number; lng: number };

const containerStyle = { width: "100%", height: "100vh" };
const defaultCenter: LatLng = { lat: 21.1458, lng: 79.0882 }; // Nagpur fallback

const parseGeo = (geo?: string | null): LatLng | null => {
    if (!geo || typeof geo !== "string") return null;
    const parts = geo.split(",");
    if (parts.length !== 2) return null;
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
};

export default function RiderMapPage() {
    const { queue, orders, fetchOrders } = useDeliveryStore();
    const [riderLocation, setRiderLocation] = useState<LatLng | null>(null);
    const [hoveredOrderId, setHoveredOrderId] = useState<string | number | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
        libraries: ["places"],
    });

    const ordersWithGeo = useMemo(() => {
        const source = (orders && orders.length > 0 ? orders : queue) || [];
        return source
            .map((order: any) => {
                const pos = parseGeo(order?.address?.geoLocation) || parseGeo(order?.deliveryAddressGeo);
                return pos ? { id: order.id ?? order._id ?? order.orderId, name: order.customerName || order.userName || "Customer", position: pos } : null;
            })
            .filter(Boolean) as { id: string | number; name: string; position: LatLng }[];
    }, [orders, queue]);

    const calculateRoute = useCallback(async () => {
        if (!isLoaded || !ordersWithGeo.length || typeof window === "undefined" || !window.google) return;

        const origin = riderLocation || ordersWithGeo[0].position;
        const destinations = ordersWithGeo.map((o) => o.position);
        const destination = destinations[destinations.length - 1];
        const waypoints = destinations.slice(0, -1).map((pos) => ({ location: pos, stopover: true }));

        const service = new google.maps.DirectionsService();
        try {
            const result = await service.route({
                origin,
                destination,
                waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
            });
            setDirectionsResponse(result);
        } catch (err) {
            console.error("Route error", err);
            toast.error("Could not load route");
        }
    }, [isLoaded, ordersWithGeo, riderLocation]);

    useEffect(() => {
        if (!ordersWithGeo.length) return;
        const timeoutId = window.setTimeout(() => {
            void calculateRoute();
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, [ordersWithGeo, riderLocation, calculateRoute]);

    useEffect(() => {
        if ((orders?.length ?? 0) > 0 || !fetchOrders) return;
        fetchOrders().catch((err) => console.error("Failed to fetch assigned orders", err));
    }, [orders, fetchOrders]);

    const handleLocate = useCallback(() => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported on this device");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setRiderLocation(loc);
                try {
                    localStorage.setItem("riderLocation", JSON.stringify(loc));
                } catch (e) {
                    console.warn("Failed to persist rider location", e);
                }
                setIsLocating(false);
            },
            (err) => {
                console.error("Locate error", err);
                toast.error("Unable to get location. Please allow location access.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    // Load rider location from localStorage, otherwise prompt for it
    useEffect(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("riderLocation") : null;
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as LatLng;
                if (parsed?.lat && parsed?.lng) {
                    const timeoutId = window.setTimeout(() => setRiderLocation(parsed), 0);
                    return () => window.clearTimeout(timeoutId);
                }
            } catch (e) {
                console.warn("Invalid stored riderLocation", e);
            }
        }
        const timeoutId = window.setTimeout(() => handleLocate(), 0);
        return () => window.clearTimeout(timeoutId);
    }, [handleLocate]);

    if (!isLoaded) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900 text-green-500 font-semibold">
                Loading map...
            </div>
        );
    }

    return (
        <div className="h-screen w-full relative bg-gray-900">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={riderLocation || ordersWithGeo[0]?.position || defaultCenter}
                zoom={13}
                options={{ disableDefaultUI: true }}
            >
                {riderLocation && (
                    <Marker
                        position={riderLocation}
                        icon={{
                            url: "https://cdn-icons-png.flaticon.com/512/3755/3755376.png",
                            scaledSize: new google.maps.Size(44, 44),
                            anchor: new google.maps.Point(22, 22),
                        }}
                    />
                )}

                {ordersWithGeo.map((order) => (
                    <Marker
                        key={order.id}
                        position={order.position}
                        icon={{
                            url: "https://cdn-icons-png.flaticon.com/512/535/535137.png",
                            scaledSize: new google.maps.Size(40, 40),
                            anchor: new google.maps.Point(20, 40),
                        }}
                        onMouseOver={() => setHoveredOrderId(order.id)}
                        onMouseOut={() => setHoveredOrderId((prev) => (prev === order.id ? null : prev))}
                    />
                ))}

                {ordersWithGeo.map(
                    (order) =>
                        hoveredOrderId === order.id && (
                            <InfoWindow
                                key={`info-${order.id}`}
                                position={order.position}
                                options={{ pixelOffset: new google.maps.Size(0, -35) }}
                            >
                                <div className="text-xs font-semibold text-gray-800">{order.name}</div>
                            </InfoWindow>
                        )
                )}

                {directionsResponse && (
                    <DirectionsRenderer
                        options={{
                            directions: directionsResponse,
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: "#22c55e",
                                strokeWeight: 6,
                                strokeOpacity: 0.85,
                            },
                        }}
                    />
                )}
            </GoogleMap>

            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <button
                    onClick={handleLocate}
                    disabled={isLocating}
                    className="bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 shadow disabled:opacity-50"
                >
                    {isLocating ? "Locating..." : "Locate Rider"}
                </button>
                <div className="bg-gray-900 text-gray-200 px-3 py-2 rounded-lg border border-gray-800 text-sm">
                    Showing rider and assigned orders
                </div>
            </div>
        </div>
    );
}