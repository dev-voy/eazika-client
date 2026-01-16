"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  Package,
  FileText,
  Tag,
  Box,
} from "lucide-react";
import { toast } from "sonner";

import { uploadMultipleImages } from "@/action/upload";
import { shopService } from "@/services/shopService";
import type { NewProductFormData, ProductPriceType } from "@/types/shop";

type ProductFormProps = {
  mode: "create" | "edit";
  initialData?: Partial<NewProductFormData> & { categoryName?: string };
  onSubmit: (data: NewProductFormData) => Promise<void>;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  successMessage?: string;
  hideBackButton?: boolean;
  onBack?: () => void;
  readOnlyCoreFields?: boolean;
};

const DEFAULT_PRICE: ProductPriceType = {
  price: 0,
  discount: 0,
  weight: 0,
  stock: 0,
  unit: "grams",
};

const DEFAULT_FORM: NewProductFormData = {
  productCategoryId: 0,
  name: "",
  brand: "",
  description: "",
  images: [],
  pricing: [DEFAULT_PRICE],
};

export function ProductForm({
  mode,
  initialData,
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel,
  successMessage,
  hideBackButton,
  onBack,
  readOnlyCoreFields = false,
}: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([
    { id: 0, name: "Loading..." },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<NewProductFormData>(() => {
    const { categoryName: _categoryName, ...restInitial } = initialData || {};
    const mergedPricing = (
      restInitial?.pricing?.length ? restInitial.pricing : DEFAULT_FORM.pricing
    ).map((price) => ({ ...DEFAULT_PRICE, ...price }));

    return {
      ...DEFAULT_FORM,
      ...restInitial,
      images: restInitial?.images ?? [],
      pricing: mergedPricing,
      productCategoryId:
        restInitial?.productCategoryId ?? DEFAULT_FORM.productCategoryId,
    };
  });

  useEffect(() => {
    if (!initialData) return;

    const { categoryName: _categoryName, ...restInitial } = initialData;

    const mergedPricing = (
      restInitial.pricing?.length ? restInitial.pricing : DEFAULT_FORM.pricing
    ).map((price) => ({ ...DEFAULT_PRICE, ...price }));

    setFormData((prev) => ({
      ...prev,
      ...restInitial,
      images: restInitial.images ?? prev.images,
      pricing: mergedPricing,
      productCategoryId:
        restInitial.productCategoryId ?? prev.productCategoryId,
    }));
  }, [initialData]);

  useEffect(() => {
    if (!initialData?.categoryName) return;
    if (formData.productCategoryId !== 0) return;
    if (!categories.length || categories[0].id === 0) return;

    const match = categories.find(
      (c) => c.name.toLowerCase() === initialData.categoryName?.toLowerCase()
    );
    if (match) {
      setFormData((prev) => ({ ...prev, productCategoryId: Number(match.id) }));
    }
  }, [categories, formData.productCategoryId, initialData?.categoryName]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await shopService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Could not load categories");
      }
    }

    if (
      categories.length === 1 &&
      categories[0].id === 0 &&
      categories[0].name === "Loading..."
    ) {
      fetchCategories();
    }
  }, [categories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      productCategoryId: parseInt(e.target.value, 10),
    }));
  };

  const handlePriceChange = <K extends keyof ProductPriceType>(
    index: number,
    key: K,
    value: ProductPriceType[K]
  ) => {
    setFormData((prev) => {
      const updatedPricing = prev.pricing.map((price, i) => {
        if (i !== index) return price;

        let validatedValue: ProductPriceType[K] = value;

        // Validate numeric fields to prevent negative values
        if (typeof value === "number") {
          validatedValue = Math.max(0, value) as ProductPriceType[K];

          // Additional validation for discount (max 100)
          if (key === "discount" && value > 100) {
            validatedValue = 100 as ProductPriceType[K];
          }
        }

        return { ...price, [key]: validatedValue };
      });
      return { ...prev, pricing: updatedPricing };
    });
  };

  const addPriceRow = () => {
    setFormData((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { ...DEFAULT_PRICE }],
    }));
  };

  const removePriceRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const result = await uploadMultipleImages(files);
      const uploaded = Array.isArray(result.urls)
        ? result.urls
        : result.urls
        ? [result.urls]
        : [];

      if (result.success && uploaded.length) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploaded].slice(0, 4),
        }));
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || formData.productCategoryId === 0) {
      toast.error("Please fill all required fields.");
      return false;
    }

    if (formData.pricing.length === 0) {
      toast.error("Add at least one price option.");
      return false;
    }

    if (formData.pricing.some((p) => !p.price || !p.stock)) {
      toast.error("Fill all required pricing fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(
        successMessage ||
          (mode === "create"
            ? "Product added successfully!"
            : "Product updated successfully!")
      );
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) return onCancel();
    router.back();
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 w-full overflow-x-hidden">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        {!hideBackButton && (
          <button
            onClick={() => (onBack ? onBack() : router.back())}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            type="button"
          >
            <ArrowLeft size={24} className="text-gray-800 dark:text-white" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {mode === "create" ? "Add New Product" : "Edit Product"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
      >
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 md:sticky md:top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Images
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {formData.images.length}/4
              </span>
            </div>

            <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center relative overflow-hidden group mb-4">
              {formData.images.length > 0 ? (
                <Image
                  src={formData.images[0]}
                  alt="Main"
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ImageIcon className="text-gray-400" size={24} />
                  </div>
                  <p className="text-xs text-gray-500">Main Image</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group bg-gray-50 dark:bg-gray-900"
                >
                  <Image
                    src={img}
                    alt={`Product ${idx}`}
                    fill
                    className="object-cover"
                  />
                  {!readOnlyCoreFields && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
              {!readOnlyCoreFields && formData.images.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors text-gray-400 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                </button>
              )}
            </div>
            {!readOnlyCoreFields && (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                multiple
              />
            )}
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              {readOnlyCoreFields
                ? "Images are managed by the global catalog."
                : "Upload up to 4 images. Max 5MB each."}
            </p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <h3 className="font-bold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4">
              Product Details
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none ${
                      readOnlyCoreFields
                        ? "opacity-70 cursor-not-allowed"
                        : "focus:border-yellow-500"
                    } dark:text-white transition-colors text-sm md:text-base`}
                    placeholder="e.g. Fresh Farm Tomatoes"
                    required
                    disabled={readOnlyCoreFields}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Brand
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      ®
                    </span>
                    <input
                      name="brand"
                      type="text"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className={`w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none ${
                        readOnlyCoreFields
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-yellow-500"
                      } dark:text-white transition-colors text-sm md:text-base`}
                      placeholder="e.g. Fresh Farms"
                      disabled={readOnlyCoreFields}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      name="category"
                      value={formData.productCategoryId}
                      onChange={handleCategoryChange}
                      className={`w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none ${
                        readOnlyCoreFields
                          ? "opacity-70 cursor-not-allowed"
                          : "focus:border-yellow-500"
                      } dark:text-white transition-colors appearance-none text-sm md:text-base`}
                      disabled={readOnlyCoreFields}
                    >
                      <option value={0} disabled>
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {formData.pricing.map((price, index) => (
                <div
                  className="grid grid-cols-2 sm:grid-cols-5 gap-1"
                  key={index}
                >
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        ₹
                      </span>
                      <input
                        name="price"
                        min="0"
                        step="0.01"
                        value={price.price}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "price",
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-yellow-500 dark:text-white transition-colors text-sm md:text-base"
                        placeholder="e.g. 100"
                        required
                      />
                    </div>
                  </div>
                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Weight
                    </label>
                    <div className="relative">
                      <input
                        name="weight"
                        min="0"
                        step="0.01"
                        value={price.weight}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "weight",
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-yellow-500 dark:text-white transition-colors text-sm md:text-base"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                  {/* Discount (%) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Discount (%)
                    </label>
                    <div className="relative">
                      <input
                        name="weight"
                        min="0"
                        step="0.01"
                        value={price.discount}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "discount",
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-yellow-500 dark:text-white transition-colors text-sm md:text-base"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                  {/* Unit */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Unit
                    </label>
                    <div className="relative">
                      <select
                        name="unit"
                        value={price.unit}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "unit",
                            e.target.value as ProductPriceType["unit"]
                          )
                        }
                        className="w-full pl-4 pr-8 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-yellow-500 dark:text-white transition-colors appearance-none text-sm md:text-base"
                      >
                        <option value="grams">grams</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="litre">litre</option>
                        <option value="piece">piece</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Box
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        name="stock"
                        min="0"
                        step="1"
                        value={price.stock}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "stock",
                            Math.max(0, parseInt(e.target.value, 10) || 0)
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-yellow-500 dark:text-white transition-colors text-sm md:text-base"
                        placeholder="e.g. 50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      &nbsp;
                    </label>
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={addPriceRow}
                        className="w-full py-3 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-yellow-600 hover:border-yellow-500 transition-colors text-sm md:text-base"
                      >
                        + Add
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removePriceRow(index)}
                        className="w-full py-3 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors text-sm md:text-base"
                      >
                        - Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Description
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none ${
                    readOnlyCoreFields
                      ? "opacity-70 cursor-not-allowed"
                      : "focus:border-yellow-500"
                  } dark:text-white transition-colors resize-none text-sm md:text-base`}
                  placeholder="Enter product details..."
                  disabled={readOnlyCoreFields}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 disabled:opacity-70 text-sm md:text-base"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CheckCircle size={18} /> {submitLabel || "Save Product"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
