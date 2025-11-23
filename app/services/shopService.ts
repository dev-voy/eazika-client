import axiosInstance from '@/app/lib/axios';

// --- Interfaces ---

export interface BankDetail {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  bankPassbookImage: string;
}

export interface ShopDocuments {
  aadharImage: string;
  electricityBillImage: string;
  businessCertificateImage: string;
  panImage: string;
}

export interface CreateShopPayload {
  shopName: string;
  shopCategory: string;
  shopImage: string[];
  fssaiNumber: string;
  gstNumber: string;
  bankDetail: BankDetail;
  documents: ShopDocuments;
}

export interface ShopProduct {
  id: number;
  name: string;
  description: string;
  images: string[];
  stock: number;
  isActive: boolean;
  price: number;
  isGlobal: boolean;
  category: string;
}

export interface ShopOrder {
  id: number;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  itemCount: number;
  createdAt: string;
  paymentMethod: string;
}

export interface ShopOrderDetail extends ShopOrder {
  customerId: number;
  customerPhone: string;
  address: string;
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  driver?: {
    id: number;
    name: string;
    phone: string;
  };
}

export interface ShopRider {
  id: number;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  activeOrders: number;
  image?: string;
  totalDeliveries?: number;
  rating?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  email: string;
  image: string;
  role: string;
}

export interface ShopProfile extends CreateShopPayload {
  id: number;
  userId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- NEW: Analytics Interface ---
export interface ShopAnalytics {
  revenueChart: { label: string; value: number }[];
  ordersChart: { label: string; value: number }[];
  metrics: {
    revenue: string;
    orders: string;
    customers: string;
    aov: string;
    // Trends for metrics (optional, can be calculated or sent by BE)
    revenueTrend?: string;
    ordersTrend?: string;
    customersTrend?: string;
    aovTrend?: string;
  };
  products: {
    name: string;
    sales: number;
    revenue: string;
  }[];
}

// --- Service Implementation ---

export const ShopService = {
  
  // 1. SHOP MANAGEMENT
  createShop: async (data: CreateShopPayload) => {
    const response = await axiosInstance.post('/shops/create-shop', data);
    return response.data;
  },

  updateShop: async (data: Partial<CreateShopPayload>) => {
    const response = await axiosInstance.put('/shops/update-shop', data);
    return response.data;
  },

  getShopProfile: async () => {
    const response = await axiosInstance.get<ShopProfile>('/shops/profile');
    return response.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post<{ url: string }>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
  },

  // 2. PRODUCT MANAGEMENT
  getInventory: async () => {
    const response = await axiosInstance.get<ShopProduct[]>('/shops/products');
    return response.data;
  },

  getGlobalCatalog: async () => {
    const response = await axiosInstance.get<ShopProduct[]>('/products/global');
    return response.data;
  },

  addProduct: async (data: any) => {
    const response = await axiosInstance.post('/shops/add-shop-product', data);
    return response.data;
  },

  updateStock: async (productId: number, stock: number) => {
    const response = await axiosInstance.put(`/shops/update-shop-product-stock/${productId}`, { stock });
    return response.data;
  },

  updateProductDetails: async (productId: number, data: any) => {
    const response = await axiosInstance.put(`/shops/update-shop-product/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: number) => {
    const response = await axiosInstance.delete(`/shops/products/${productId}`);
    return response.data;
  },

  // 3. ORDER MANAGEMENT
  getShopOrders: async (status?: string) => {
    const params = status && status !== 'all' ? { status } : {};
    const response = await axiosInstance.get<ShopOrder[]>('/shops/orders', { params });
    return response.data;
  },

  getShopOrderById: async (id: number) => {
    const response = await axiosInstance.get<ShopOrderDetail>(`/shops/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const response = await axiosInstance.put(`/shops/orders/${id}/status`, { status });
    return response.data;
  },

  // 4. RIDER MANAGEMENT
  getShopRiders: async () => {
    const response = await axiosInstance.get<ShopRider[]>('/shops/riders');
    return response.data;
  },

  searchUserByPhone: async (phone: string) => {
    const response = await axiosInstance.get<UserProfile>('/shops/get-user', { params: { phone } });
    return response.data;
  },

  sendRiderInvite: async (userId: number) => {
    const response = await axiosInstance.patch('/shops/send-invite-to-delivery', { userId });
    return response.data;
  },

  assignRider: async (orderId: number, riderId: number) => {
    const response = await axiosInstance.post(`/shops/orders/${orderId}/assign`, { riderId });
    return response.data;
  },

  removeRider: async (riderId: number) => {
    const response = await axiosInstance.delete(`/shops/riders/${riderId}`);
    return response.data;
  },

  // 5. ANALYTICS (NEW)
  // Assumed Endpoint: GET /shops/analytics?range=Today
  getAnalytics: async (range: string) => {
    const response = await axiosInstance.get<ShopAnalytics>('/shops/analytics', { 
        params: { range } 
    });
    return response.data;
  }
};