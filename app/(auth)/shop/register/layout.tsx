import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Owner Registration - Eazika",
  description:
    "Create your Eazika account to start enjoying a seamless shopping experience. Whether you're a customer looking for great deals, a rider ready to deliver, or a shop owner eager to grow your business, register now to access personalized features and manage your orders, deliveries, and shop settings with ease.",
  keywords: [
    "Eazika Register",
    "Eazika Sign Up",
    "Eazika Create Account",
    "Eazika Customer Registration",
    "Eazika Rider Registration",
    "Eazika Shop Owner Registration",
  ],

  metadataBase: new URL("https://eazika.com/shop/register"),
  alternates: { canonical: "/shop/register" },

  openGraph: {
    title: "Shop Owner Registration - Eazika",
    description:
      "Create your Eazika account to start enjoying a seamless shopping experience. Whether you're a customer looking for great deals, a rider ready to deliver, or a shop owner eager to grow your business, register now to access personalized features and manage your orders, deliveries, and shop settings with ease.",
    url: "https://eazika.com/shop/register",
    siteName: "Eazika",
    images: [
      "/logo.png",
      "https://eazika.com/logo.png",
      "https://eazika.com/icon.png",
    ],
  },
};

function ShopRegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default ShopRegisterLayout;
