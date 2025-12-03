import {
  Apple,
  Carrot,
  Milk,
  Coffee,
  Cookie,
  Fish,
  Cake,
  SprayCan,
  LucideIcon,
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  category: string;
  isTrending: boolean;
  liked: boolean; // Mock state for initial render
}

// export interface Banner {
//   id: number;
//   title: string;
//   subtitle: string;
//   backgroundColor: string;
//   textColor: string;
//   link: string;
// }

export const categories: Category[] = [
  { id: "cat-01", name: "Fresh Fruits", slug: "fresh-fruits", icon: Apple },
  { id: "cat-02", name: "Vegetables", slug: "vegetables", icon: Carrot },
  { id: "cat-03", name: "Dairy & Eggs", slug: "dairy-eggs", icon: Milk },
  { id: "cat-04", name: "Beverages", slug: "beverages", icon: Coffee },
  { id: "cat-05", name: "Snacks", slug: "snacks", icon: Cookie },
  { id: "cat-06", name: "Meat & Fish", slug: "meat-fish", icon: Fish },
  { id: "cat-07", name: "Bakery", slug: "bakery", icon: Cake },
  { id: "cat-08", name: "Household", slug: "household", icon: SprayCan },
];

export const products: Product[] = [
  {
    id: "p-01",
    name: "Organic Bananas (1kg)",
    price: 49.0,
    images: ["https://placehold.co/600x600/ffe59a/333?text=Banana"],
    rating: 4.8,
    category: "Fresh Fruits",
    isTrending: true,
    liked: false,
  },
  {
    id: "p-02",
    name: "Full Cream Milk (1L)",
    price: 65.0,
    images: ["https://placehold.co/600x600/87CEFA/333?text=Milk"],
    rating: 4.5,
    category: "Dairy & Eggs",
    isTrending: false,
    liked: true,
  },
  {
    id: "p-03",
    name: "Extra Crunchy Chips",
    price: 99.0,
    images: ["https://placehold.co/600x600/FFD700/333?text=Chips"],
    rating: 4.9,
    category: "Snacks",
    isTrending: true,
    liked: false,
  },
  {
    id: "p-04",
    name: "Fresh Tomatoes (500g)",
    price: 35.0,
    images: ["https://placehold.co/600x600/FF6347/333?text=Tomato"],
    rating: 4.2,
    category: "Vegetables",
    isTrending: false,
    liked: false,
  },
  {
    id: "p-05",
    name: "Artisan Bread Loaf",
    price: 120.0,
    images: ["https://placehold.co/600x600/D2B48C/333?text=Bread"],
    rating: 4.7,
    category: "Bakery",
    isTrending: true,
    liked: true,
  },
  {
    id: "p-06",
    name: "Chicken Breast (500g)",
    price: 180.0,
    images: [
      "https://placehold.co/600x600/A52A2A/333?text=Chicken",
      "https://placehold.co/600x600/A52A2A/333?text=Chicken2",
    ],
    rating: 4.6,
    category: "Meat & Fish",
    isTrending: false,
    liked: false,
  },
  {
    id: "p-07",
    name: "Diet Coke (300ml)",
    price: 30.0,
    images: ["https://placehold.co/600x600/0000FF/FFF?text=Coke"],
    rating: 4.1,
    category: "Beverages",
    isTrending: true,
    liked: false,
  },
  {
    id: "p-08",
    name: "Dishwasher Pods (20 Pcs)",
    price: 450.0,
    images: ["https://placehold.co/600x600/B0E0E6/333?text=Pods"],
    rating: 4.4,
    category: "Household",
    isTrending: false,
    liked: false,
  },
];

// export const mockBanners: Banner[] = [
//   {
//     id: 1,
//     title: "Flash Sale! Up to 40% Off",
//     subtitle: "On all organic vegetables",
//     backgroundColor: "bg-green-600",
//     textColor: "text-white",
//     link: "/categories/vegetables",
//   },
//   {
//     id: 2,
//     title: "Free Delivery Today",
//     subtitle: "On orders over ₹500",
//     backgroundColor: "bg-yellow-400",
//     textColor: "text-gray-900",
//     link: "/checkout",
//   },
//   {
//     id: 3,
//     title: "Dairy & Eggs Mega Offer",
//     subtitle: "Buy 2, Get 1 Free!",
//     backgroundColor: "bg-blue-600",
//     textColor: "text-white",
//     link: "/categories/dairy-eggs",
//   },
// ];
