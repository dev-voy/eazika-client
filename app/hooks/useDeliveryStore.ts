import { create } from 'zustand';

// Define Types
export type OrderStatus = 'available' | 'picked_up' | 'awaiting_otp' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  pickupAddress: string;
  dropAddress: string;
  items: string[];
  earnings: number;
  distance: string;
  status: OrderStatus;
}

interface DeliveryState {
  availableOrders: Order[];
  activeOrder: Order | null;
  isOnline: boolean;
  
  // Actions
  toggleOnlineStatus: () => void;
  acceptOrder: (orderId: string) => void;
  updateActiveOrderStatus: (status: OrderStatus) => void;
  confirmDeliveryWithOtp: (otp: string, correctOtp: string) => boolean;
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  // Mock Data for "New Orders Available"
  availableOrders: [
    {
      id: 'ORD-001',
      customerName: 'Alice Johnson',
      pickupAddress: 'Burger King, Central Mall',
      dropAddress: '123 Green Park, Block A',
      items: ['Whopper Meal', 'Coke'],
      earnings: 45.00,
      distance: '2.3 km',
      status: 'available'
    },
    {
      id: 'ORD-002',
      customerName: 'Rajesh Kumar',
      pickupAddress: 'Medical Store, Sector 4',
      dropAddress: 'Plot 55, Shivaji Nagar',
      items: ['Medicine Package'],
      earnings: 30.00,
      distance: '1.1 km',
      status: 'available'
    }
  ],
  activeOrder: null,
  isOnline: true,

  toggleOnlineStatus: () => set((state) => ({ isOnline: !state.isOnline })),

  acceptOrder: (orderId) => set((state) => {
    const orderToAccept = state.availableOrders.find(o => o.id === orderId);
    if (!orderToAccept) return state;

    return {
      activeOrder: { ...orderToAccept, status: 'picked_up' }, // Initial active state
      availableOrders: state.availableOrders.filter(o => o.id !== orderId)
    };
  }),

  updateActiveOrderStatus: (status) => set((state) => {
    if (!state.activeOrder) return state;
    return { activeOrder: { ...state.activeOrder, status } };
  }),

  confirmDeliveryWithOtp: (otp, correctOtp) => {
    if (otp === correctOtp) {
      set({ activeOrder: null }); // Clear order on success
      return true;
    }
    return false;
  }
}));