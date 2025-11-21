import axiosInstance from '@/app/lib/axios';

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

export const UserService = {
  // Auth
  logout: async () => {
    const response = await axiosInstance.post('/users/logout');
    return response.data;
  },
  
  refresh: async (refreshToken?: string) => {
    const response = await axiosInstance.post('/users/refresh', { refreshToken });
    return response.data;
  },

  // Profile
  getMe: async () => {
    const response = await axiosInstance.get<User>('/users/user/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    const response = await axiosInstance.patch<User>('/users/user/me', data);
    return response.data;
  },

  updateProfilePicture: async (imageUrl: string) => {
    const response = await axiosInstance.patch<User>('/users/user/update-profile-picture', { image: imageUrl });
    return response.data;
  },

  // Addresses
  // ADDED: Get all addresses
  getAddresses: async () => {
    // Assuming endpoint based on conventions. If 404, returns empty array in UI logic.
    const response = await axiosInstance.get<Address[]>('/users/user/addresses');
    return response.data;
  },

  addAddress: async (data: AddressPayload) => {
    const response = await axiosInstance.post<Address>('/users/user/add-new-address', data);
    return response.data;
  },

  updateAddress: async (addressId: number, data: AddressPayload) => {
    const response = await axiosInstance.patch<Address>(`/users/user/update-address/${addressId}`, data);
    return response.data;
  },

  deleteAddress: async (addressId: number) => {
    const response = await axiosInstance.delete(`/users/user/delete-address/${addressId}`);
    return response.data;
  }
};