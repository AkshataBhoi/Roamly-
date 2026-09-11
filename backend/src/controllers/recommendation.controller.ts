import { Request, Response } from 'express';
import { searchNearbyPlaces } from '../services/osm.service';

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

// Fetch Wikipedia thumbnail for a given title
const fetchWikiThumbnail = async (title: string): Promise<string | null> => {
  try {
    const resp = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=400&titles=${encodeURIComponent(
        title
      )}&origin=`
    );
    const data = await resp.json();
    const pages = data.query?.pages;
    const page = pages && Object.values(pages)[0];
    return page?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
};

// Resolve image URL for a given OSM node
const getImageForNode = async (node: any, mood: string): Promise<string> => {
  if (node.tags?.image) return node.tags.image;
  if (node.tags?.wikimedia_commons) {
    const fileName = node.tags.wikimedia_commons.replace('File:', '');
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=400`;
  }
  if (node.tags?.wikipedia) {
    const title = node.tags.wikipedia.split(':')[1];
    const thumb = await fetchWikiThumbnail(title);
    if (thumb) return thumb;
  }
  // Fallback to Unsplash with deterministic seed
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(
    node.tags?.amenity || mood
  )}&seed=${node.id}`;
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

    const formattedPlaces = await Promise.all(
      places.slice(0, 15).map(async (node) => {
        const rating = 3.5 + (node.id % 15) / 10;
        const reviewCount = (node.id % 500) + 10;
        const distance = (Math.random() * (radius / 1000)).toFixed(1);
        const image = await getImageForNode(node, mood);
        return {
          id: node.id.toString(),
          name: node.tags?.name || 'Unknown Place',
          category: node.tags?.amenity || node.tags?.tourism || node.tags?.leisure || mood,
          rating: parseFloat(rating.toFixed(1)),
          reviewCount,
          distance: `${distance} km away`,
          image,
          bestFor: [mood, node.tags?.amenity || ''],
          coordinates: { x: node.lon, y: node.lat, label: node.tags?.name || '' },
          description: `${node.tags?.name || 'This place'} is a nice ${
            node.tags?.amenity || 'spot'
          } recommended for your ${mood} mood.`,
        };
      })
    );

    return res.json({ places: formattedPlaces });
  } catch (error) {
    console.error('Recommendation error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching recommendations' });
  }
};