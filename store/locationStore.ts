import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import coustomerService from "@/services/customerService";

interface LocationState {
  currentCity: string | null;
  supportedCities: string[]; 
  isLocationVerified: boolean;

  setLocation: (city: string) => void;
  fetchSupportedCities: () => Promise<void>;
  resetLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentCity: null,
      supportedCities: [],
      isLocationVerified: false,

      setLocation: (city) =>
        set({
          currentCity: city,
          isLocationVerified: true,
        }),

      
      fetchSupportedCities: async () => {
        try {
          const cities = await coustomerService.getAvailableCities();
          
          const formattedCities = cities.map(
            (c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
          );
          set({ supportedCities: formattedCities });
        } catch (error) {
          console.error("Store failed to load cities", error);
        }
      },

      resetLocation: () =>
        set({
          currentCity: null,
          isLocationVerified: false,
        }),
    }),
    {
      name: "eazika-location-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
