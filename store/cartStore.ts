import { create } from "zustand";
import { cartMethods } from "@/services/customerService";
import { CartItem, AddToCartPayload, OrderPayload } from "@/types/products";

type ItemId = string | number;

interface CartState {
  items: CartItem[];
  selectedItems: Set<ItemId>;
  isLoading: boolean;
  cartCount: number;
  cartTotalAmount: number;

  // Actions
  fetchCart: () => Promise<void>;
  setSelectedItems: (itemId: ItemId | ItemId[]) => void;
  addToCart: (data: AddToCartPayload) => Promise<void>;
  removeFromCart: (itemId: ItemId) => Promise<void>;
  updateQuantity: (itemId: ItemId, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (data: OrderPayload) => Promise<void>;
}

// Helper to calculate total
const calculateTotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const cartStore = create<CartState>((set: SetState, get: Get) => ({
  items: [],
  selectedItems: new Set(),
  isLoading: false,
  cartCount: 0,
  cartTotalAmount: 0,

  fetchCart: () => fetchCartData(set),
  setSelectedItems: (item: ItemId | ItemId[]) =>
    setSelectedItemsData(item, get, set),
  addToCart: (data) => addToCartData(data, get, set),
  removeFromCart: (itemId) => removeFromCartData(Number(itemId), get, set),
  updateQuantity: (itemId, quantity) =>
    updateQuantityData(Number(itemId), quantity, get, set),
  clearCart: () => clearCartData(get, set),
  placeOrder: (data: OrderPayload) => placeOrderData(data, get, set),
}));

type Get = () => CartState;
type SetState = (
  state: Partial<CartState> | ((state: CartState) => Partial<CartState>)
) => void;

/* ============================ Actions ============================ */
const fetchCartData = async (set: SetState) => {
  set({ isLoading: true });
  try {
    const data = await cartMethods.getCart();
    const cartItems = Array.isArray(data) ? data : [];

    set({
      items: cartItems,
      cartCount: cartItems.length,
      cartTotalAmount: calculateTotal(cartItems),
    });
  } finally {
    set({ isLoading: false });
  }
};

const setSelectedItemsData = (
  item: ItemId | ItemId[],
  get: Get,
  set: SetState
) => {
  const selectedItems = new Set(get().selectedItems);
  if (Array.isArray(item)) {
    item.forEach((id) => selectedItems.add(id));
    if (item.length === 0) selectedItems.clear();
  } else {
    if (selectedItems.has(item)) selectedItems.delete(item);
    else selectedItems.add(item);
  }
  set({ selectedItems });
};

const addToCartData = async (
  data: AddToCartPayload,
  get: Get,
  set: SetState
) => {
  set({ isLoading: true });
  try {
    if (!get().items.find((item) => item.productId === data.productId)) {
      await cartMethods.addToCart(data);
      await get().fetchCart();
    }
  } finally {
    set({ isLoading: false });
  }
};
const removeFromCartData = async (itemId: number, get: Get, set: SetState) => {
  const previousItems = get().items;
  const updatedItems = previousItems.filter((i) => i.id !== itemId);

  set({
    items: updatedItems,
    cartCount: updatedItems.length,
    cartTotalAmount: calculateTotal(updatedItems),
  });

  try {
    await cartMethods.removeCartItem(itemId);
  } catch (error) {
    console.error("Failed to remove item:", error);
    // Revert if failed
    set({
      items: previousItems,
      cartCount: previousItems.length,
      cartTotalAmount: calculateTotal(previousItems),
    });
  }
};
const updateQuantityData = async (
  itemId: number,
  quantity: number,
  get: Get,
  set: SetState
) => {
  if (quantity < 1) return;

  const previousItems = get().items;
  const updatedItems = previousItems.map((i) =>
    i.id === itemId ? { ...i, quantity } : i
  );

  set({
    items: updatedItems,
    cartTotalAmount: calculateTotal(updatedItems),
  });

  try {
    await cartMethods.updateCartItem(itemId, { quantity });
  } catch (error) {
    console.error("Failed to update quantity:", error);
    // Revert if failed
    set({
      items: previousItems,
      cartTotalAmount: calculateTotal(previousItems),
    });
  }
};
const clearCartData = async (get: Get, set: SetState) => {
  const previousItems = get().items;
  set({ items: [], cartCount: 0, cartTotalAmount: 0 });

  try {
    await cartMethods.clearCart();
  } catch (error) {
    console.error("Failed to clear cart:", error);
    // Optionally revert, but usually clear cart isn't critical to revert unless strict
    set({
      items: previousItems,
      cartCount: previousItems.length,
      cartTotalAmount: calculateTotal(previousItems),
    });
  }
};
const placeOrderData = async (data: OrderPayload, get: Get, set: SetState) => {
  set({ isLoading: true });
  try {
    const order = await cartMethods.createOrder(data);
    await get().clearCart();
    return order;
  } finally {
    set({ isLoading: false });
  }
};
