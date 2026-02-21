import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rider Login - Eazika",
  description:
    "Login to your Eazika Rider account to access your personalized dashboard. Manage your deliveries, view your earnings, and stay updated with your assigned orders. Sign in to provide seamless delivery service and track your performance with ease.",
  keywords: [
    "Eazika Rider Login",
    "Eazika Delivery Login",
    "Eazika Courier Login",
    "Eazika Rider Sign In",
    "Eazika Delivery Sign In",
  ],

  metadataBase: new URL("https://eazika.com/login/rider"),
  alternates: { canonical: "/login/rider" },

  openGraph: {
    title: "Rider Login - Eazika",
    description:
      "Login to your Eazika Rider account to access your personalized dashboard. Manage your deliveries, view your earnings, and stay updated with your assigned orders. Sign in to provide seamless delivery service and track your performance with ease.",
    url: "https://eazika.com/login/rider",
    siteName: "Eazika",
    images: [
      "/logo.png",
      "https://eazika.com/logo.png",
      "https://eazika.com/icon.png",
    ],
  },
};

function RiderLoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default RiderLoginLayout;
