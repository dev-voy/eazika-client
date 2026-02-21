import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Eazika",
  description:
    "Read Eazika's Terms and Conditions to understand the rules and guidelines for using our services. Our Terms and Conditions outline your rights and responsibilities as a user, including information about account creation, order placement, delivery, payment, and dispute resolution. By using Eazika, you agree to comply with these terms and ensure a safe and enjoyable shopping experience for everyone.",
  keywords: [
    "Eazika Terms and Conditions",
    "Eazika User Agreement",
    "Eazika Service Terms",
    "Eazika Rules and Guidelines",
    "Eazika User Responsibilities",
    "Eazika Legal Terms",
  ],

  metadataBase: new URL("https://eazika.com/terms-and-conditions"),
  alternates: { canonical: "/terms-and-conditions" },

  openGraph: {
    title: "Terms and Conditions - Eazika",
    description:
      "Read Eazika's Terms and Conditions to understand the rules and guidelines for using our services. Our Terms and Conditions outline your rights and responsibilities as a user, including information about account creation, order placement, delivery, payment, and dispute resolution. By using Eazika, you agree to comply with these terms and ensure a safe and enjoyable shopping experience for everyone.",
    url: "https://eazika.com/terms-and-conditions",
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
