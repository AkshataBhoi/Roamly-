import { Place, RecommendationQuery } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface IRecommendationService {
  getRecommendations(query: RecommendationQuery): Promise<Place[]>;
  getPlaceById(id: string): Promise<Place | undefined>;
  geocodeAddress(address: string): Promise<{ latitude: number; longitude: number; address: string } | null>;
  reverseGeocode(lat: number, lng: number): Promise<string | null>;
}

class RecommendationService implements IRecommendationService {
  async getRecommendations(query: RecommendationQuery): Promise<Place[]> {
    try {
      const { time, mood, preferenceText, latitude, longitude } = query;
      
      // Default coordinates if not provided (e.g., fallback for testing without location)
      const lat = latitude || 40.7128; // default to NYC if none
      const lng = longitude || -74.0060;

      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          availableTime: time,
          mood,
          preferences: preferenceText
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching recommendations: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.places.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        categoryEmoji: "📍", // Default emoji
        rating: p.rating,
        distance: p.distance,
        visitDuration: time,
        description: p.description,
        matchScore: Math.floor(Math.random() * 20) + 80, // 80-99% pseudo score
        matchReason: `Matches your ${mood} mood perfectly.`,
        image: p.imageUrl,
        bestFor: [mood, p.category],
        coordinates: {
          x: p.coordinates.lng,
          y: p.coordinates.lat,
          label: p.name
        }
      }));
    } catch (error) {
      console.error("Error in getRecommendations:", error);
      return []; // Return empty array or throw error depending on desired UX
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
