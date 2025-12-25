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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Pricing & Variants</h3>
                <button type="button" onClick={addVariant} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    <Plus size={16} /> Add Variant
                </button>
            </div>

            <div className="space-y-4">
                {pricing.map((option, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Price (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={option.price}
                                    onChange={(e) => handleChange(index, "price", e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Discount (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={option.discount || 0}
                                    onChange={(e) => handleChange(index, "discount", e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Weight</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={option.weight}
                                    onChange={(e) => handleChange(index, "weight", e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Unit</label>
                                <select
                                    value={option.unit}
                                    onChange={(e) => handleChange(index, "unit", e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm"
                                >
                                    {["grams", "kg", "ml", "litre", "piece"].map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Stock</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={option.stock}
                                        onChange={(e) => handleChange(index, "stock", e.target.value)}
                                        className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm"
                                    />
                                    {pricing.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 transition">
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
