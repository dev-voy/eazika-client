import axios from 'axios';

// --- Types ---

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  defaultAddressId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  userId: number;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  image?: string;
}

export interface AddressPayload {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

// --- API Setup ---

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.eazika.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies (refresh token)
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Service
export const UserService = {
  // Auth
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
  
  refresh: async (refreshToken?: string) => {
    const response = await api.post('/users/refresh', { refreshToken });
    return response.data;
  },

  // Profile
  getMe: async () => {
    const response = await api.get<User>('/users/user/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    const response = await api.patch<User>('/users/user/me', data);
    return response.data;
  },

  updateProfilePicture: async (imageUrl: string) => {
    const response = await api.patch<User>('/users/user/update-profile-picture', { image: imageUrl });
    return response.data;
  },

  // Addresses
  addAddress: async (data: AddressPayload) => {
    const response = await api.post<Address>('/users/user/add-new-address', data);
    return response.data;
  },

  updateAddress: async (addressId: number, data: AddressPayload) => {
    const response = await api.patch<Address>(`/users/user/update-address/${addressId}`, data);
    return response.data;
  },

  deleteAddress: async (addressId: number) => {
    const response = await api.delete(`/users/user/delete-address/${addressId}`);
    return response.data;
  }
};