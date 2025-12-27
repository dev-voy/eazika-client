"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ProductPriceType } from "@/types/shop";

type PriceFormProps = {
    initialPricing?: ProductPriceType[];
    submitLabel?: string;
    onSubmit: (pricing: ProductPriceType[]) => void;
    onCancel?: () => void;
};

const DEFAULT_PRICE: ProductPriceType = {
    price: 0,
    discount: 0,
    weight: 0,
    unit: "grams",
    stock: 0,
};

const normalizeList = (list?: ProductPriceType[]) => {
    if (!list || list.length === 0) return [{ ...DEFAULT_PRICE }];
    return list.map((item) => ({
        id: item.id,
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
        weight: Number(item.weight) || 0,
        unit: item.unit || "grams",
        stock: Number(item.stock) || 0,
    }));
};

export function PriceForm({ initialPricing, submitLabel = "Save Pricing", onSubmit, onCancel }: PriceFormProps) {
    const [pricing, setPricing] = useState<ProductPriceType[]>(normalizeList(initialPricing));

    useEffect(() => {
        setPricing(normalizeList(initialPricing));
    }, [initialPricing]);

    const handleChange = (index: number, field: keyof ProductPriceType, value: string | number) => {
        setPricing((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: field === "unit" ? value : Number(value) || 0 } as ProductPriceType;
            return next;
        });
    };

    const addVariant = () => setPricing((prev) => [...prev, { ...DEFAULT_PRICE }]);

    const removeVariant = (index: number) => {
        setPricing((prev) => {
            const next = prev.filter((_, i) => i !== index);
            return next.length > 0 ? next : [{ ...DEFAULT_PRICE }];
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(normalizeList(pricing));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pricing & Variants</h3>
                <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                >
                    <Plus size={16} /> Add Variant
                </button>
            </div>

            <div className="space-y-4">
                {pricing.map((option, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Variant #{index + 1}</span>
                            {pricing.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-900 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        <div className="p-4 grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={option.price}
                                        onChange={(e) => handleChange(index, "price", e.target.value)}
                                        className="w-full pl-8 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Discount (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={option.discount || 0}
                                    onChange={(e) => handleChange(index, "discount", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Weight</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={option.weight}
                                    onChange={(e) => handleChange(index, "weight", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Unit</label>
                                <select
                                    value={option.unit}
                                    onChange={(e) => handleChange(index, "unit", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:border-indigo-500"
                                >
                                    {["grams", "kg", "ml", "litre", "piece"].map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-medium text-gray-500">Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={option.stock}
                                    onChange={(e) => handleChange(index, "stock", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 transition"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}

export default PriceForm;
