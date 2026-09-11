import { Place, RecommendationQuery } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface IRecommendationService {
  getRecommendations(query: RecommendationQuery): Promise<Place[]>;
  getPlaceById(id: string): Promise<Place | undefined>;
  geocodeAddress(address: string): Promise<{ latitude: number; longitude: number; address: string } | null>;
  reverseGeocode(lat: number, lng: number): Promise<string | null>;
}

// Helper to map UI time string to backend's required format
const mapTimeToBackendFormat = (timeStr: string): string => {
  const normalized = timeStr.toLowerCase().replace(/\s+/g, '_');
  if (normalized.includes('1') || normalized === '1_hour') return '1_hour';
  if (normalized.includes('3') || normalized === '3_hours') return '3_hours';
  if (normalized.includes('half') || normalized === 'half_day') return 'half_day';
  if (normalized.includes('full') || normalized === 'full_day') return 'full_day';
  return '3_hours'; // Fallback default
}; 

class RecommendationService implements IRecommendationService {

async getRecommendations(query: RecommendationQuery): Promise<Place[]> {
  try {
    const { time, mood, preferenceText, latitude, longitude } = query;
    
    const lat = latitude ?? 40.7128;
    const lng = longitude ?? -74.0060;

    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: Number(lat),
        longitude: Number(lng),
        availableTime: mapTimeToBackendFormat(time || '3_hours'), // Matches backend expectations
        mood: mood || 'relaxed',
        preferences: preferenceText || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const placesArray = data.places || [];

    return placesArray.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category || "Point of Interest",
      categoryEmoji: "📍",
      rating: p.rating || 4.5,
      distance: p.distance || "Nearby",
      visitDuration: time,
      description: p.description,
      matchScore: Math.floor(Math.random() * 20) + 80,
      matchReason: `Matches your ${mood} mood perfectly.`,
      image: p.image || "/placeholder-place.jpg",
      bestFor: [mood, p.category].filter(Boolean),
      latitude: p.coordinates?.lat || lat,
      longitude: p.coordinates?.lng || lng,
      // Use backend-provided coordinates (x, y)
      coordinates: {
        x: p.coordinates?.x ?? p.longitude ?? lng,
        y: p.coordinates?.y ?? p.latitude ?? lat,
        label: p.name,
      },
    }));
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    throw error;
  }
}

  async getPlaceById(id: string): Promise<Place | undefined> {
    // In a real app, this might call a specific endpoint like /api/places/:id
    // For now, returning undefined since we'd need to cache or refetch
    return undefined;
  }

  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number; address: string } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/location/geocode?address=${encodeURIComponent(address)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/location/reverse?lat=${lat}&lng=${lng}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.address;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return null;
    }
  }
}

export const recommendationService = new RecommendationService();
