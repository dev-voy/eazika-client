import { create } from 'zustand';
import { CartService, CartItem, AddToCartPayload } from '@/app/services/cartService';
import { products as mockProducts } from '@/app/data/mockData'; 

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartPayload) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

// Helper: Merge API cart items (IDs) with Mock Data (Images/Names)
// This is necessary because the API might only return IDs, but the UI needs details.
const mapCartItemsWithDetails = (apiItems: CartItem[]) => {
  return apiItems.map(item => {
    // Match API 'shopProductId' (e.g., 1) with Mock 'id' (e.g., 'p-01')
    const product = mockProducts.find(p => parseInt(p.id.replace('p-', '')) === item.shopProductId);
    
    if (product) {
      return {
        ...item,
        productDetails: {
          name: product.name,
          image: product.images[0],
          price: product.price
        }
      };
    }
    // Fallback if product details not found
    return {
        ...item,
        productDetails: {
            name: "Product Item",
            image: "https://placehold.co/600x600?text=No+Image",
            price: 0
        }
    };
  });
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  cartCount: 0,
  cartTotal: 0,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const data = await CartService.getCart();
      const itemsWithDetails = mapCartItemsWithDetails(data);
      
      set({ 
        items: itemsWithDetails, 
        cartCount: itemsWithDetails.length,
        cartTotal: calculateTotal(itemsWithDetails)
      });
    } catch (error) {
      console.error("Failed to fetch cart", error);
      // If 401 or error, likely empty cart or not logged in
      set({ items: [], cartCount: 0, cartTotal: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (data) => {
    set({ isLoading: true });
    try {
      await CartService.addToCart(data);
      // Refresh cart to get the correct database ID and merged details
      await get().fetchCart(); 
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (itemId) => {
    // Optimistic Update: Update UI immediately
    const previousItems = get().items;
    const updatedItems = previousItems.filter((i) => i.id !== itemId);
    set({
      items: updatedItems,
      cartCount: updatedItems.length,
      cartTotal: calculateTotal(updatedItems)
    });

    try {
      await CartService.removeCartItem(itemId);
    } catch (error) {
      console.error("Failed to remove item", error);
      // Revert on failure
      set({ 
          items: previousItems, 
          cartCount: previousItems.length,
          cartTotal: calculateTotal(previousItems) 
      });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return;

    // Optimistic Update
    const previousItems = get().items;
    const updatedItems = previousItems.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    set({
      items: updatedItems,
      cartTotal: calculateTotal(updatedItems)
    });

    try {
      await CartService.updateCartItem(itemId, { quantity });
    } catch (error) {
      console.error("Failed to update quantity", error);
      // Revert on failure
      set({ 
          items: previousItems, 
          cartTotal: calculateTotal(previousItems) 
      });
    }
  },

  clearCart: async () => {
    // Optimistic Clear
    set({ items: [], cartCount: 0, cartTotal: 0 });
    try {
        await CartService.clearCart();
    } catch (error) {
        console.error("Failed to clear cart", error);
    }
  }
}));

// Helper to calculate total
const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    const price = item.productDetails?.price || 0;
    return total + (price * item.quantity);
  }, 0);
};