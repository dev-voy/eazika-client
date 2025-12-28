import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import coustomerService from "@/services/customerService";

interface LocationState {
  currentCity: string | null;
  supportedCities: string[];
  isLocationVerified: boolean;
  geoLocation: { lat: number; lng: number } | null;

  setLocation: (city: string) => void;
  setGeoLocation: (coords: { lat: number; lng: number } | null) => void;
  fetchSupportedCities: () => Promise<void>;
  resetLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentCity: null,
      supportedCities: [],
      isLocationVerified: false,
      geoLocation: null,

      setLocation: (city) =>
        set({
          currentCity: city,
          isLocationVerified: true,
        }),

      setGeoLocation: (coords) =>
        set({
          geoLocation: coords,
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
          geoLocation: null,
        }),
    }),
    {
      name: "eazika-location-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
