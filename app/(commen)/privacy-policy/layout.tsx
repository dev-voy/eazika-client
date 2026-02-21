import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Eazika",
  description:
    "Read Eazika's Privacy Policy to understand how we collect, use, and protect your personal information. We are committed to safeguarding your privacy and ensuring transparency in our data practices. Learn about your rights and how we handle your data when you use our services.",
  keywords: [
    "Eazika Privacy Policy",
    "Eazika Data Protection",
    "Eazika Personal Information",
    "Eazika Privacy Practices",
    "Eazika User Data",
    "Eazika Privacy Rights",
  ],

  metadataBase: new URL("https://eazika.com/privacy-policy"),
  alternates: { canonical: "/privacy-policy" },

  openGraph: {
    title: "Privacy Policy - Eazika",
    description:
      "Read Eazika's Privacy Policy to understand how we collect, use, and protect your personal information. We are committed to safeguarding your privacy and ensuring transparency in our data practices. Learn about your rights and how we handle your data when you use our services.",
    url: "https://eazika.com/privacy-policy",
    siteName: "Eazika",
    images: [
      "/logo.png",
      "https://eazika.com/logo.png",
      "https://eazika.com/icon.png",
    ],
  },
};

function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default LoginLayout;
