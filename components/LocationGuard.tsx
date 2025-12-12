"use client";

import React, { useEffect, useState } from "react";
import { useLocationStore } from "@/store/locationStore";
import {
  MapPin,
  Navigation,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function LocationGuard() {
  const {
    currentCity,
    isLocationVerified,
    setLocation,
    supportedCities,
    fetchSupportedCities,
  } = useLocationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch the list of active cities from the backend on mount
  useEffect(() => {
    fetchSupportedCities();
  }, []);

  // 2. Open the modal if the user hasn't selected a location yet
  useEffect(() => {
    if (!isLocationVerified) {
      setIsOpen(true);
    }
  }, [isLocationVerified]);

  const detectLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse Geocoding via OpenStreetMap (Nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          // Nominatim can return city in different fields depending on the location type
          const detectedCity =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county;

          if (detectedCity) {
            checkCitySupport(detectedCity);
          } else {
            toast.error(
              "Could not determine your city. Please select manually."
            );
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          toast.error("Failed to detect location details.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Location access error:", error);
        toast.error(
          "Location access denied. Please select your city manually."
        );
        setIsLoading(false);
      }
    );
  };

  const checkCitySupport = (city: string) => {
    // Check if the detected city is in our dynamic supported list (Case-insensitive)
    const matchedCity = supportedCities.find(
      (c) => c.toLowerCase() === city.toLowerCase()
    );

    if (matchedCity) {
      setLocation(matchedCity);
      setIsOpen(false);
      toast.success(`Welcome to Eazika ${matchedCity}!`);
    } else {
      toast.error(
        `Eazika is not yet available in ${city}. Please select a supported city.`
      );
    }
  };

  // Do not render anything if the modal is closed
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6">
              {/* Header Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-500 animate-pulse">
                  <MapPin size={32} />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Select Your City
              </h2>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                We show products available in your area. <br />
                Eazika is currently live in select Tier 3 cities.
              </p>

              {/* Detect Location Button */}
              <button
                onClick={detectLocation}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl mb-6 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Navigation size={18} />
                )}
                {isLoading ? "Detecting..." : "Detect My Location"}
              </button>

              {/* Divider */}
              <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-400 uppercase">
                  Or Select City
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              {/* Dynamic City List */}
              <div className="mt-2 max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                {supportedCities.length > 0 ? (
                  supportedCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocation(city);
                        setIsOpen(false);
                        toast.success(`Location set to ${city}`);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-500">
                        {city}
                      </span>
                      {currentCity === city && (
                        <CheckCircle2 size={18} className="text-green-500" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No active cities found.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      (Shops need to be onboarded first)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex gap-2 items-start text-xs text-gray-500 dark:text-gray-400">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>
                  If your city isn't listed, we haven't launched there yet. Stay
                  tuned!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
