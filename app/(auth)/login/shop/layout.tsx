import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Owner Login - Eazika",
  description:
    "Login to your Eazika account to access your personalized shopping experience. Whether you're a customer, rider, or shop owner, sign in to manage your orders, deliveries, and shop settings with ease.",
  keywords: [
    "Eazika Login",
    "Eazika Sign In",
    "Eazika Account Access",
    "Eazika Customer Login",
    "Eazika Rider Login",
    "Eazika Shop Owner Login",
  ],

  metadataBase: new URL("https://eazika.com/login/shop"),
  alternates: { canonical: "/login/shop" },

  openGraph: {
    title: "Shop Owner Login - Eazika",
    description:
      "Login to your Eazika account to access your personalized shopping experience. Whether you're a customer, rider, or shop owner, sign in to manage your orders, deliveries, and shop settings with ease.",
    url: "https://eazika.com/login/shop",
    siteName: "Eazika",
    images: [
      "/logo.png",
      "https://eazika.com/logo.png",
      "https://eazika.com/icon.png",
    ],
  },
};

function ShopLoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default ShopLoginLayout;
