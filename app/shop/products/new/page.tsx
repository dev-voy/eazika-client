"use client";

import { useRouter } from "next/navigation";

import { ProductForm } from "@/components/shop/ProductForm";
import { shopService } from "@/services/shopService";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <ProductForm
      mode="create"
      onSubmit={async (data) => {
        await shopService.addProduct(data);
      }}
      onSuccess={() => router.push("/shop/products")}
      successMessage="Product added successfully!"
      submitLabel="Save Product"
    />
  );
}
