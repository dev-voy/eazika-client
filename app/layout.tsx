import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// CHANGED: Named import with curly braces
import { Providers } from "@/app/components/Providers"; 
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eazika - Shop Instantly, Live Effortlessly",
    template: "%s | Eazika",
  },
  description:
    "Experience the future of shopping with EAZIKA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getAnalyticsId = process.env.GOOGLE_ANALYTICS_ID; 

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ... meta tags ... */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers> 
      </body>
    </html>
  );
}