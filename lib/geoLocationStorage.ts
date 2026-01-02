// Utility functions for managing geolocation in localStorage

const GEO_LOCATION_KEY = "user_geo_location";

export interface GeoCoordinates {
    lat: number;
    lng: number;
}

/**
 * Store geolocation coordinates in localStorage
 * @param coords - Latitude and longitude coordinates
 */
export const storeGeoLocation = (coords: GeoCoordinates): void => {
    try {
        localStorage.setItem(GEO_LOCATION_KEY, JSON.stringify(coords));
    } catch (error) {
        console.error("Failed to store geolocation:", error);
    }
};

/**
 * Retrieve geolocation coordinates from localStorage
 * @returns GeoCoordinates if available, null otherwise
 */
export const getStoredGeoLocation = (): GeoCoordinates | null => {
    try {
        const stored = localStorage.getItem(GEO_LOCATION_KEY);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        if (parsed.lat !== undefined && parsed.lng !== undefined) {
            return { lat: parsed.lat, lng: parsed.lng };
        }
        return null;
    } catch (error) {
        console.error("Failed to retrieve geolocation:", error);
        return null;
    }
};

/**
 * Clear geolocation from localStorage
 */
export const clearGeoLocation = (): void => {
    try {
        localStorage.removeItem(GEO_LOCATION_KEY);
    } catch (error) {
        console.error("Failed to clear geolocation:", error);
    }
};

/**
 * Check if geolocation exists in localStorage
 */
export const hasStoredGeoLocation = (): boolean => {
    return getStoredGeoLocation() !== null;
};
