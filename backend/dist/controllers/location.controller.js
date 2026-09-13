"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = exports.geocode = void 0;
const osm_service_1 = require("../services/osm.service");
const geocode = async (req, res) => {
    try {
        const { address } = req.query;
        if (!address || typeof address !== 'string') {
            return res.status(400).json({ error: 'Address query parameter is required' });
        }
        const result = await (0, osm_service_1.geocodeAddress)(address);
        if (result) {
            return res.json({
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                address: result.display_name,
            });
        }
        else {
            return res.status(400).json({ error: 'Unable to pinpoint selected geolocation. Please enter a valid address manually.' });
        }
    }
    catch (error) {
        console.error('Geocoding error:', error);
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
            return res.status(503).json({ error: 'Geolocation service is temporarily unavailable. Please try again later.' });
        }
        return res.status(400).json({ error: 'Unable to pinpoint selected geolocation. Please enter a valid address manually.' });
    }
};
exports.geocode = geocode;
const reverse = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng || typeof lat !== 'string' || typeof lng !== 'string') {
            return res.status(400).json({ error: 'Latitude and longitude query parameters are required' });
        }
        const address = await (0, osm_service_1.reverseGeocode)(parseFloat(lat), parseFloat(lng));
        if (address) {
            return res.json({ address });
        }
        else {
            return res.status(400).json({ error: 'Unable to pinpoint selected geolocation. Please enter a valid address manually.' });
        }
    }
    catch (error) {
        console.error('Reverse geocoding error:', error);
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
            return res.status(503).json({ error: 'Reverse geolocation service is temporarily unavailable. Please try again later.' });
        }
        return res.status(400).json({ error: 'Unable to pinpoint selected geolocation. Please enter a valid address manually.' });
    }
};
exports.reverse = reverse;
