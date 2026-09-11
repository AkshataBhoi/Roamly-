import { Request, Response } from 'express';
import { geocodeAddress, reverseGeocode } from '../services/osm.service';

export const geocode = async (req: Request, res: Response) => {
  try {
    const { address } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address query parameter is required' });
    }

    const result = await geocodeAddress(address);

    if (result) {
      return res.json({
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
      });
    } else {
      return res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return res.status(500).json({ error: 'Internal server error during geocoding' });
  }
};

export const reverse = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng || typeof lat !== 'string' || typeof lng !== 'string') {
      return res.status(400).json({ error: 'Latitude and longitude query parameters are required' });
    }

    const address = await reverseGeocode(parseFloat(lat), parseFloat(lng));

    if (address) {
      return res.json({ address });
    } else {
      return res.status(404).json({ error: 'Address not found for these coordinates' });
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return res.status(500).json({ error: 'Internal server error during reverse geocoding' });
  }
};
