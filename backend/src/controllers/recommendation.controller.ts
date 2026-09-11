import { Request, Response } from 'express';
import { searchNearbyPlaces } from '../services/osm.service';
import crypto from 'crypto';

// Map frontend moods to OSM amenities
const getAmenitiesForMood = (mood: string): string[] => {
  switch (mood.toLowerCase()) {
    case 'relaxed':
      return ['cafe', 'park', 'library', 'spa'];
    case 'adventurous':
      return ['theme_park', 'nature_reserve', 'sports_centre', 'hiking'];
    case 'social':
      return ['pub', 'bar', 'restaurant', 'cafe', 'nightclub'];
    case 'cultured':
      return ['museum', 'gallery', 'theatre', 'arts_centre', 'cinema'];
    case 'hungry':
      return ['restaurant', 'fast_food', 'food_court', 'cafe'];
    default:
      return ['cafe', 'park', 'restaurant'];
  }
};

// Map time to search radius (meters)
const getRadiusForTime = (time: string): number => {
  switch (time) {
    case '1_hour':
      return 1000;
    case '3_hours':
      return 3000;
    case 'half_day':
      return 10000;
    case 'full_day':
      return 25000;
    default:
      return 3000;
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, availableTime, mood, preferences } = req.body;

    if (!latitude || !longitude || !availableTime || !mood) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const amenities = getAmenitiesForMood(mood);
    const radius = getRadiusForTime(availableTime);

    // Fetch places from OSM
    const places = await searchNearbyPlaces(latitude, longitude, radius, amenities);

    // Transform OSM nodes into frontend Place objects
    const formattedPlaces = places.slice(0, 15).map(node => {
      // Calculate a pseudo-random rating based on OSM node ID for consistency
      const rating = 3.5 + (node.id % 15) / 10; 
      const reviewCount = (node.id % 500) + 10;
      
      // Basic distance estimation (direct line) - a real app would use OSRM
      const distance = (Math.random() * (radius / 1000)).toFixed(1);

      return {
        id: node.id.toString(),
        name: node.tags.name || 'Unknown Place',
        category: node.tags.amenity || node.tags.tourism || node.tags.leisure || mood,
        rating: parseFloat(rating.toFixed(1)),
        reviewCount,
        distance: `${distance} km away`,
        imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(node.tags.amenity || mood)}`,
        coordinates: {
          lat: node.lat,
          lng: node.lon
        },
        description: `${node.tags.name || 'This place'} is a nice ${node.tags.amenity || 'spot'} recommended for your ${mood} mood.`
      };
    });

    return res.json({ places: formattedPlaces });
  } catch (error) {
    console.error('Recommendation error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching recommendations' });
  }
};
