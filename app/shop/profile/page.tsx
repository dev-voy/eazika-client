"use client";

import { useEffect, useState } from "react";
import { ShopService } from "@/services/shopService";

type ShopProfilePayload = {
    id?: number;
    shopName?: string;
    shopCategory?: string;
    shopImages?: string[];
    fssaiNumber?: string;
    gstNumber?: string;
    documents?: Record<string, string>;
    userId?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

type ShopAddressPayload = {
    name?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    street?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    geoLocation?: string;
};

export default function ShopProfile() {
    const [profile, setProfile] = useState<ShopProfilePayload | null>(null);
    const [address, setAddress] = useState<ShopAddressPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [p, addr] = await Promise.all([
                    ShopService.getShopProfile().catch(() => null),
                    ShopService.getShopAddress().catch(() => null),
                ]);
                if (!isMounted) return;
                setProfile(p as ShopProfilePayload | null);
                setAddress((addr as any)?.data || (addr as ShopAddressPayload | null) || null);
            } catch (err: any) {
                if (!isMounted) return;
                setError("Unable to load shop profile right now.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        void load();
        return () => {
            isMounted = false;
        };
    }, []);

    const infoRow = (label: string, value?: string | number | null) => (
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {value ?? "Not provided"}
            </span>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Shop Profile</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Overview of your shop and owner details.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500">Shop</p>
                                <h2 className="text-xl font-bold">{profile?.shopName ?? "Your Shop"}</h2>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${profile?.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                                {profile?.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {infoRow("Category", profile?.shopCategory)}
                            {infoRow("FSSAI", profile?.fssaiNumber)}
                            {infoRow("GST", profile?.gstNumber)}
                            {infoRow("Created", profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : undefined)}
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Documents</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(profile?.documents || {}).length === 0 && (
                                    <p className="text-sm text-gray-500">No documents uploaded.</p>
                                )}
                                {Object.entries(profile?.documents || {}).map(([key, url]) => (
                                    <a
                                        key={key}
                                        className="text-sm text-blue-600 dark:text-blue-400 underline truncate"
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {key}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Owner</p>
                        <div className="space-y-2">
                            {infoRow("Owner Name", address?.name || profile?.shopName)}
                            {infoRow("Phone", address?.phone)}
                            {infoRow("User ID", profile?.userId)}
                            {infoRow("Shop ID", profile?.id)}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Address</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {infoRow("Line 1", address?.line1)}
                        {infoRow("Line 2", address?.line2)}
                        {infoRow("Street", address?.street)}
                        {infoRow("City", address?.city)}
                        {infoRow("State", address?.state)}
                        {infoRow("PIN", address?.pinCode)}
                        {infoRow("Geo", address?.geoLocation)}
                    </div>
                </div>
            </div>
        </div>
    );
}