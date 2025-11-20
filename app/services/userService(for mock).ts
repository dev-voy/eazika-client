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
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to simulate API delay (Mocking)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Service
export const UserService = {
  // Auth
  logout: async () => {
    // Mock logout
    await delay(500);
    return { success: true };
  },
  
  refresh: async (refreshToken?: string) => {
    const response = await api.post('/users/refresh', { refreshToken });
    return response.data;
  },

  // Profile
  getMe: async () => {
    // Try real API, fallback to mock if it fails (handled in Store usually, but we can mock here too if needed)
    try {
        const response = await api.get<User>('/users/user/me');
        return response.data;
    } catch (error) {
        console.warn("API unreachable, returning mock user.");
        await delay(500);
        return {
            id: 1,
            name: "Rafatul Islam",
            phone: "9876543210",
            email: "rafatul@example.com",
            image: null,
            role: "user",
            isActive: true,
            isPhoneVerified: true,
            isEmailVerified: false,
            defaultAddressId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    // MOCK IMPLEMENTATION
    // const response = await api.patch<User>('/users/user/me', data);
    // return response.data;
    
    await delay(1000); // Simulate network wait
    console.log("Mock API: Profile updated", data);
    
    // Return a mock user object with updated fields
    return {
        id: 1,
        name: data.name || "Rafatul Islam",
        phone: "9876543210",
        email: data.email || "rafatul@example.com",
        image: data.image || null,
        role: "user",
        isActive: true,
        isPhoneVerified: true,
        isEmailVerified: false,
        defaultAddressId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as User;
  },

  updateProfilePicture: async (imageUrl: string) => {
    // MOCK IMPLEMENTATION
    // const response = await api.patch<User>('/users/user/update-profile-picture', { image: imageUrl });
    // return response.data;

    await delay(1000);
    console.log("Mock API: Picture updated", imageUrl);

    return {
        id: 1,
        name: "Rafatul Islam",
        phone: "9876543210",
        email: "rafatul@example.com",
        image: imageUrl, // Return new image
        role: "user",
        isActive: true,
        isPhoneVerified: true,
        isEmailVerified: false,
        defaultAddressId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as User;
  },

  // Addresses
  addAddress: async (data: AddressPayload) => {
    // const response = await api.post<Address>('/users/user/add-new-address', data);
    // return response.data;
    await delay(500);
    return { id: Math.random(), userId: 1, ...data } as Address;
  },

  updateAddress: async (addressId: number, data: AddressPayload) => {
    // const response = await api.patch<Address>(`/users/user/update-address/${addressId}`, data);
    // return response.data;
    await delay(500);
    return { id: addressId, userId: 1, ...data } as Address;
  },

  deleteAddress: async (addressId: number) => {
    // const response = await api.delete(`/users/user/delete-address/${addressId}`);
    // return response.data;
    await delay(500);
    return { success: true };
  }
};