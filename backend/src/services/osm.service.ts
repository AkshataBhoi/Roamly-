import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Ensure a user agent is set as required by Nominatim's usage policy
const HEADERS = {
  'User-Agent': 'RoamlyApp/1.0 (Student Project)',
};

export interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: HEADERS,
    });

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error in geocodeAddress:', error);
    throw new Error('Failed to geocode address');
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: HEADERS,
    });

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }
    return null;
  } catch (error) {
    console.error('Error in reverseGeocode:', error);
    throw new Error('Failed to reverse geocode coordinates');
  }
};

export interface OverpassNode {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

export const searchNearbyPlaces = async (
  lat: number,
  lon: number,
  radius: number, // in meters
  amenities: string[]
): Promise<OverpassNode[]> => {
  // Build Overpass QL query
  // Example: node["amenity"~"cafe|restaurant"](around:radius,lat,lon);
  const amenityRegex = amenities.join('|');
  const query = `
    [out:json];
    (
      node["amenity"~"${amenityRegex}"](around:${radius},${lat},${lon});
      node["tourism"~"${amenityRegex}"](around:${radius},${lat},${lon});
      node["leisure"~"${amenityRegex}"](around:${radius},${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await axios.post(OVERPASS_API_URL, `data=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data && response.data.elements) {
      return response.data.elements.filter((el: any) => el.tags && el.tags.name);
    }
    return [];
  } catch (error) {
    console.error('Error in searchNearbyPlaces:', error);
    throw new Error('Failed to fetch nearby places from Overpass API');
  }
};
