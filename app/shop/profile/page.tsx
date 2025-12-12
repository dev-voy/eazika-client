"use client";

import { userStore } from "@/store";

export default function ShopProfilePage() {
  const { user } = userStore();
  return <div>Shop Profile Page - {user?.name}</div>;
}
