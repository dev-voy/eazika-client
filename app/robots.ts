import type { MetadataRoute } from "next";

const SITE_URL = process.env.WEBSITE_URL || "https://eazika.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/login",
          "/login/rider",
          "/login/shop",
          "/register",
          "/shop/register",
          "/rider/register",

          "/categories",
          "/products",
          "/products/*",

          "/contact-us",
          "/privacy-policy",
          "/terms-and-conditions",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
