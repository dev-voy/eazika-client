import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserService, User, UpdateProfilePayload } from '@/app/services/userService';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  fetchUser: () => Promise<void>;
  updateUser: (data: UpdateProfilePayload) => Promise<void>;
  logout: () => Promise<void>;
  setAuthToken: (token: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuthToken: (token: string) => {
        localStorage.setItem('accessToken', token);
        set({ isAuthenticated: true });
      },

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          // Mocking data if API fails or no token (for dev visualization)
          try {
            const userData = await UserService.getMe();
            set({ user: userData, isAuthenticated: true });
          } catch (apiError) {
             // Fallback mock data for development UI preview
             console.warn("API failed, using mock data", apiError);
             const mockUser: User = {
                id: 1,
                name: "Rafatul Islam",
                email: "rafatul@example.com",
                phone: "9876543210",
                image: null,
                role: "user",
                isActive: true,
                isPhoneVerified: true,
                isEmailVerified: false,
                defaultAddressId: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
             };
             set({ user: mockUser, isAuthenticated: true });
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: async (data) => {
        set({ isLoading: true });
        try {
          const updatedUser = await UserService.updateProfile(data);
          set({ user: updatedUser });
        } catch (error) {
          console.error("Failed to update profile", error);
          // Optimistic update for demo
          const currentUser = get().user;
          if (currentUser) {
             set({ user: { ...currentUser, ...data } });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await UserService.logout();
        } catch (error) {
          console.error("Logout failed", error);
        }
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false });
        // Redirect handled by component
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);