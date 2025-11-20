import axios from 'axios';

// --- Types based on your API Docs ---

export interface CartItem {
  id: number;
  userId: number;
  shopProductId: number;
  productPriceId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  // Optional: Extended details for UI display (merged later with product data)
  productDetails?: {
    name: string;
    image: string;
    price: number;
  };
}

export interface AddToCartPayload {
  shopProductId: number;
  productPriceId: number;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}

export interface OrderPayload {
  addressId: number;
  paymentMethod: string;
}

// --- API Service ---

// Replace with your actual backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.eazika.com';

const api = axios.create({
  baseURL: API_URL,
});

// Add interceptor to inject token (Assuming you store it in localStorage)
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const CartService = {
  addToCart: async (data: AddToCartPayload) => {
    const response = await api.post('/customers/add-to-cart', data);
    return response.data;
  },

  getCart: async () => {
    const response = await api.get<CartItem[]>('/customers/get-cart');
    return response.data;
  },

  updateCartItem: async (itemId: number, data: UpdateCartPayload) => {
    const response = await api.put(`/customers/update-cart-item/${itemId}`, data);
    return response.data;
  },

  removeCartItem: async (itemId: number) => {
    const response = await api.delete(`/customers/remove-cart-item/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/customers/clear-cart');
    return response.data;
  },

  createOrder: async (data: OrderPayload) => {
    const response = await api.post('/customers/create-order', data);
    return response.data;
  }
};