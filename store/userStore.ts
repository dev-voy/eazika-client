import { create } from "zustand";
import type { User, Address, NewAddressPayload } from "@/types/user";
import { userService } from "@/services/userService";

interface UserState {
  user: User | null;
  addresses: Address[];
  isAuthenticated: boolean;
  isLoading: boolean;

  // // Actions
  fetchUser: (fresh?: "fresh" | null) => Promise<void>;
  updateUser: (data: User) => Promise<void>;
  addNewAddress: (address: NewAddressPayload) => Promise<Address>;
  logout: () => Promise<void>;
}

export const userStore = create<UserState>((set, get) => ({
  user: null,
  addresses: [],
  isAuthenticated: false,
  isLoading: false,

  fetchUser: (fresh = null) => fetchUserData(set, fresh),
  updateUser: (data: User) => updateUserData(data, set),
  addNewAddress: (address: NewAddressPayload) =>
    addNewAddressData(address, get),
  logout: async () => logoutUser(set),
}));

/* ============================ Type Aliases ============================ */
type Get = () => UserState;
type Set = (
  state: Partial<UserState> | ((state: UserState) => Partial<UserState>)
) => void;
/* ============================ Actions ============================ */

const fetchUserData = async (set: Set, fresh: "fresh" | null) => {
  set({ isLoading: true });
  try {
    const storedData = localStorage.getItem("eazika-user-data");
    if (storedData && fresh !== "fresh") {
      const data = JSON.parse(storedData) as User;
      set({
        user: data,
        isAuthenticated: true,
        addresses: data.addresses || [],
      });
    } else {
      const data = await userService.getMe();
      set({
        user: data,
        isAuthenticated: true,
        addresses: data.addresses || [],
      });
      localStorage.setItem("eazika-user-data", JSON.stringify(data));
    }
  } finally {
    set({ isLoading: false });
  }
};

const updateUserData = async (data: User, set: Set) => {
  set({ isLoading: true });
  try {
    const updatedUser = await userService.updateProfile(data);
    set({ user: updatedUser });
  } finally {
    set({ isLoading: false });
  }
};

const addNewAddressData = async (
  address: NewAddressPayload,
  get: Get
): Promise<Address> => {
  const addr = await userService.addAddress(address);
  await get().fetchUser("fresh");
  return addr;
};

const logoutUser = async (set: Set) => {
  set({ isLoading: true });
  try {
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies - compatible with all browsers including Safari
    const clearCookie = (name: string) => {
      // Clear with different path and domain combinations for Safari compatibility
      const expiry = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = `${name}=; ${expiry}; path=/;`;
      document.cookie = `${name}=; ${expiry}; path=/; domain=${window.location.hostname};`;
      document.cookie = `${name}=; ${expiry}; path=/; SameSite=Lax;`;
      document.cookie = `${name}=; ${expiry}; path=/; SameSite=Strict;`;
      document.cookie = `${name}=; ${expiry}; path=/; SameSite=None; Secure;`;
    };

    // Clear specific auth cookies
    clearCookie("accessToken");
    clearCookie("userRole");
    clearCookie("refreshToken");

    // Clear all other cookies as fallback
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      if (cookieName) {
        clearCookie(cookieName);
      }
    });

    // Reset state
    set({ user: null, addresses: [], isAuthenticated: false });

    // Hard reload to login page (works better in Safari)
    window.location.replace("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Force redirect even if there's an error
    window.location.replace("/login");
  } finally {
    set({ isLoading: false });
  }
};
