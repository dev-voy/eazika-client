import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Eazika",
  description:
    "Have questions or need assistance? Contact Eazika's support team for help with your orders, deliveries, or account. We're here to provide you with the best shopping experience possible. Reach out to us via email, phone, or our online contact form, and we'll get back to you as soon as possible.",
  keywords: [
    "Eazika Contact Us",
    "Eazika Support",
    "Eazika Customer Service",
    "Eazika Help",
    "Eazika Assistance",
    "Eazika Contact Information",
  ],

  metadataBase: new URL("https://eazika.com/contact-us"),
  alternates: { canonical: "/contact-us" },

  openGraph: {
    title: "Contact Us - Eazika",
    description:
      "Have questions or need assistance? Contact Eazika's support team for help with your orders, deliveries, or account. We're here to provide you with the best shopping experience possible. Reach out to us via email, phone, or our online contact form, and we'll get back to you as soon as possible.",
    url: "https://eazika.com/contact-us",
    siteName: "Eazika",
    images: [
      "/logo.png",
      "https://eazika.com/logo.png",
      "https://eazika.com/icon.png",
    ],
  },
};

function ContactUsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default ContactUsLayout;
