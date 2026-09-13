"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchNearbyPlaces = exports.getAmenitiesForMood = exports.reverseGeocode = exports.geocodeAddress = exports.API_HEADERS = void 0;
const axios_1 = __importDefault(require("axios"));
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
// Primary & fallback public Overpass endpoints to handle timeouts and 503 errors gracefully
const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
exports.API_HEADERS = {
    'User-Agent': 'RoamlyApp/1.0 (Student Project)',
};
const geocodeAddress = async (address) => {
    try {
        const response = await axios_1.default.get(`${NOMINATIM_BASE_URL}/search`, {
            params: {
                q: address,
                format: 'json',
                limit: 1,
            },
            headers: exports.API_HEADERS,
        });
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    }
    catch (error) {
        console.error('Error in geocodeAddress:', error);
        throw new Error('Failed to geocode address');
    }
};
exports.geocodeAddress = geocodeAddress;
const reverseGeocode = async (lat, lon) => {
    try {
        const response = await axios_1.default.get(`${NOMINATIM_BASE_URL}/reverse`, {
            params: {
                lat,
                lon,
                format: 'json',
            },
            headers: exports.API_HEADERS,
        });
        if (response.data && response.data.display_name) {
            return response.data.display_name;
        }
        return null;
    }
    catch (error) {
        console.error('Error in reverseGeocode:', error);
        throw new Error('Failed to reverse geocode coordinates');
    }
};
exports.reverseGeocode = reverseGeocode;
/**
 * Maps frontend mood options to comprehensive OpenStreetMap multi-tag filters
 */
const getAmenitiesForMood = (mood) => {
    const normalizedMood = (mood || '').toLowerCase().trim();
    switch (normalizedMood) {
        case 'relax':
        case 'relaxed':
            return {
                amenity: ['cafe', 'library', 'spa', 'tea_house'],
                leisure: ['park', 'garden', 'nature_reserve'],
            };
        case 'explore':
            return {
                tourism: ['artwork', 'attraction', 'viewpoint'],
                amenity: ['marketplace', 'bookshop'],
                leisure: ['park'],
            };
        case 'nature':
            return {
                leisure: ['park', 'garden', 'nature_reserve'],
                tourism: ['viewpoint', 'campsite'],
            };
        case 'food':
        case 'hungry':
            return {
                amenity: ['restaurant', 'cafe', 'food_court', 'fast_food', 'pub', 'ice_cream', 'bakery'],
            };
        case 'adventure':
        case 'adventurous':
            return {
                leisure: ['sports_centre', 'pitch', 'track', 'playground'],
                tourism: ['theme_park', 'zoo'],
            };
        case 'culture':
        case 'cultured':
            return {
                tourism: ['museum', 'gallery', 'attraction'],
                historic: ['monument', 'castle', 'ruins', 'memorial'],
                amenity: ['theatre', 'arts_centre', 'cinema'],
            };
        default:
            return {
                amenity: ['cafe', 'restaurant'],
                leisure: ['park', 'garden'],
                tourism: ['attraction', 'viewpoint'],
            };
    }
};
exports.getAmenitiesForMood = getAmenitiesForMood;
/**
 * Fetches nearby places from Overpass API across multiple tag keys with mirror fallbacks
 */
const searchNearbyPlaces = async (lat, lon, radius, // in meters
filterConfig) => {
    let config;
    if (Array.isArray(filterConfig)) {
        config = { amenity: filterConfig };
    }
    else {
        config = filterConfig;
    }
    const clauses = [];
    const tagEntries = [
        ['amenity', config.amenity],
        ['tourism', config.tourism],
        ['leisure', config.leisure],
        ['historic', config.historic],
        ['craft', config.craft],
        ['shop', config.shop],
    ];
    for (const [tagKey, values] of tagEntries) {
        if (values && values.length > 0) {
            const regex = values.join('|');
            clauses.push(`node["${tagKey}"~"^(${regex})$"](around:${radius},${lat},${lon});`);
            clauses.push(`way["${tagKey}"~"^(${regex})$"](around:${radius},${lat},${lon});`);
        }
    }
    if (clauses.length === 0) {
        clauses.push(`node["amenity"](around:${radius},${lat},${lon});`);
    }
    const query = `
    [out:json][timeout:15];
    (
      ${clauses.join('\n      ')}
    );
    out center 40;
  `;
    // Try endpoints sequentially in case of rate limits or 503 timeouts
    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const response = await axios_1.default.post(endpoint, `data=${encodeURIComponent(query)}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': exports.API_HEADERS['User-Agent'],
                    'Accept': 'application/json',
                },
                timeout: 5000,
            });
            if (response.data && Array.isArray(response.data.elements)) {
                const elements = response.data.elements
                    .filter((el) => el && el.tags && (el.tags.name || el.tags['name:en']))
                    .map((el) => ({
                    id: el.id,
                    lat: Number(typeof el.lat === 'number' ? el.lat : el.center?.lat),
                    lon: Number(typeof el.lon === 'number' ? el.lon : el.center?.lon),
                    tags: el.tags,
                }))
                    .filter((el) => !isNaN(el.lat) && !isNaN(el.lon));
                return elements;
            }
        }
        catch (error) {
            console.warn(`Overpass endpoint failed (${endpoint}):`, error.message || error);
        }
    }
    // If all Overpass servers fail, flag upstream error for HTTP 503 response
    const upstreamErr = new Error('Overpass API timeout or network error');
    upstreamErr.isUpstream = true;
    throw upstreamErr;
};
exports.searchNearbyPlaces = searchNearbyPlaces;
