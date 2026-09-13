"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.fetchRealPlaceImage = void 0;
const osm_service_1 = require("../services/osm.service");
// Map time to search radius (meters) and calculate compatibility
const parseTimeLogic = (timeInput) => {
    const normalized = (timeInput || '').toLowerCase().replace(/[\s_-]+/g, '');
    if (normalized.includes('30m') || normalized.includes('30min')) {
        return { key: '30m', radius: 1500, label: '30 min', longWindow: false };
    }
    if (normalized.includes('1h') || normalized.includes('1hour') || normalized === '1') {
        return { key: '1h', radius: 2500, label: '1 hour', longWindow: false };
    }
    if (normalized.includes('3h') || normalized.includes('3hour') || normalized.includes('2h') || normalized === '3') {
        return { key: '3h', radius: 4000, label: '3 hours', longWindow: false };
    }
    if (normalized.includes('half')) {
        return { key: 'half_day', radius: 10000, label: 'Half day', longWindow: true };
    }
    if (normalized.includes('full')) {
        return { key: 'full_day', radius: 25000, label: 'Full day', longWindow: true };
    }
    // Fallback defaults
    return { key: '3h', radius: 4000, label: '3 hours', longWindow: false };
};
// Normalize mood
const normalizeMood = (moodInput) => {
    const m = (moodInput || '').toLowerCase().trim();
    if (m === 'relaxed' || m === 'relax')
        return 'relax';
    if (m === 'explore' || m === 'exploring')
        return 'explore';
    if (m === 'nature')
        return 'nature';
    if (m === 'hungry' || m === 'food')
        return 'food';
    if (m === 'adventurous' || m === 'adventure')
        return 'adventure';
    if (m === 'cultured' || m === 'culture')
        return 'culture';
    return m || 'relax';
};
/**
 * Fetch direct Wikipedia thumbnail image for a given title
 */
const fetchWikiThumbnail = async (title) => {
    try {
        const cleanTitle = title.replace(/^File:/i, '').trim();
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(cleanTitle)}&pithumbsize=600&format=json&origin=*`;
        const resp = await fetch(url, {
            headers: {
                'User-Agent': 'RoamlyApp/1.0',
            },
        });
        if (!resp.ok)
            return null;
        const data = await resp.json();
        const pages = data.query?.pages;
        if (!pages)
            return null;
        const page = Object.values(pages)[0];
        return page?.thumbnail?.source ?? null;
    }
    catch {
        return null;
    }
};
/**
 * Search Wikipedia for a place name (optionally with location/city context)
 */
const searchWikiForPlace = async (placeName, city) => {
    try {
        const query = city ? `${placeName} ${city}` : placeName;
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;
        const resp = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'RoamlyApp/1.0',
            },
        });
        if (!resp.ok)
            return null;
        const data = await resp.json();
        const searchResults = data.query?.search;
        if (!searchResults || searchResults.length === 0)
            return null;
        const matchedTitle = searchResults[0].title;
        return await fetchWikiThumbnail(matchedTitle);
    }
    catch {
        return null;
    }
};
/**
 * Category-specific baseline images for deterministic Unsplash fallbacks
 */
const CATEGORY_FALLBACK_BASES = {
    cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    park: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f',
    garden: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    museum: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7',
    gallery: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119',
    historic: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5',
    adventure: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6',
    explore: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82',
    relax: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
    library: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
    spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
};
/**
 * Real-Time Dynamic Image Resolution Pipeline:
 * Step 1: Check if the OSM node tags contain direct image, wikimedia_commons, or wikipedia keys.
 * Step 2: If no photo tag exists, query Wikipedia API directly using the placeName and optional city.
 * Step 3: Fallback to a deterministic, unique image seed per place based on node ID and place category.
 */
const fetchRealPlaceImage = async (placeName, category, tags, nodeId, city) => {
    try {
        // 1. Direct image tag in OSM node
        if (tags.image && typeof tags.image === 'string' && tags.image.startsWith('http')) {
            return tags.image;
        }
        // 2. Wikimedia Commons file reference
        if (tags.wikimedia_commons) {
            const fileName = tags.wikimedia_commons.replace(/^File:/i, '').trim();
            return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=600`;
        }
        // 3. Wikipedia article tag
        if (tags.wikipedia) {
            const title = tags.wikipedia.includes(':') ? tags.wikipedia.split(':')[1] : tags.wikipedia;
            const thumb = await fetchWikiThumbnail(title);
            if (thumb)
                return thumb;
        }
        // 4. Query Wikipedia API directly using placeName and city
        if (placeName && placeName.length > 2 && placeName !== 'Unknown Place' && placeName !== 'Local Destination') {
            const nameThumb = await searchWikiForPlace(placeName, city);
            if (nameThumb)
                return nameThumb;
        }
    }
    catch (error) {
        console.warn(`Dynamic image fetch error for ${placeName}:`, error);
    }
    // Step 3: Deterministic fallback with category-specific base image and unique node-seeded signature
    const catKey = (category || 'relax').toLowerCase();
    const matchedBase = Object.entries(CATEGORY_FALLBACK_BASES).find(([key]) => catKey.includes(key))?.[1] ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
    const rawSeed = `${nodeId}_${encodeURIComponent(placeName)}`;
    return `${matchedBase}?auto=format&fit=crop&w=600&q=80&sig=${rawSeed}`;
};
exports.fetchRealPlaceImage = fetchRealPlaceImage;
/**
 * Calculates preference relevance score based on specific user quirks & desires
 * Boosts place rankings using preferenceText by matching terms against OSM tags:
 * description, cuisine, outdoor_seating, wheelchair, opening_hours, note, name, amenity, tourism, leisure.
 */
const calculatePreferenceScore = (node, preferenceTerms) => {
    if (preferenceTerms.length === 0)
        return 0;
    let score = 0;
    const tags = node.tags || {};
    const searchableText = [
        tags.name,
        tags['name:en'],
        tags.description,
        tags.cuisine,
        tags.outdoor_seating,
        tags.wheelchair,
        tags.opening_hours,
        tags.note,
        tags.amenity,
        tags.tourism,
        tags.leisure,
        tags.historic,
        tags.craft,
        tags.shop,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    for (const term of preferenceTerms) {
        if (searchableText.includes(term)) {
            score += 25;
        }
    }
    return score;
};
const getRecommendations = async (req, res) => {
    const { latitude, longitude } = req.body;
    const rawTime = req.body.availableTime || req.body.time || '';
    const rawMood = req.body.mood || '';
    const rawPreferences = req.body.preferenceText || req.body.preferences || '';
    const locationLabel = req.body.location || req.body.address || 'Selected Location';
    // Strict parameter validation
    if (!latitude || !longitude || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
        return res.status(400).json({
            error: 'Unable to pinpoint selected geolocation. Please enter a valid address manually.',
        });
    }
    const normalizedMood = normalizeMood(rawMood);
    const timeConfig = parseTimeLogic(rawTime);
    const lat = Number(latitude);
    const lon = Number(longitude);
    try {
        // 1. Mood Filter & Radius Configuration
        const filterConfig = (0, osm_service_1.getAmenitiesForMood)(normalizedMood);
        const radius = timeConfig.radius;
        // 2. Fetch candidate places from Overpass API
        const candidateNodes = await (0, osm_service_1.searchNearbyPlaces)(lat, lon, radius, filterConfig);
        // 3. Strict Mood Compatibility Filter
        // For 'relax', strictly match relaxing spots (cafes, libraries, spas, parks, quiet gardens, tea houses)
        const validNodes = candidateNodes.filter((node) => {
            const tags = node.tags || {};
            const cat = [tags.amenity, tags.leisure, tags.tourism, tags.historic].filter(Boolean).join(' ').toLowerCase();
            if (normalizedMood === 'relax') {
                const isRelaxing = cat.includes('cafe') ||
                    cat.includes('library') ||
                    cat.includes('spa') ||
                    cat.includes('tea') ||
                    cat.includes('park') ||
                    cat.includes('garden') ||
                    cat.includes('nature_reserve');
                return isRelaxing;
            }
            return true;
        });
        // 4. Parse and extract key descriptive terms from preferenceText
        const preferenceTerms = rawPreferences
            .toLowerCase()
            .split(/[,\s]+/)
            .map((t) => t.trim())
            .filter((t) => t.length > 2 && !['with', 'near', 'and', 'the', 'for', 'any', 'some', 'place', 'places'].includes(t));
        // 5. Score and sort candidates by preference boost + proximity
        const scoredNodes = validNodes.map((node) => {
            const prefScore = calculatePreferenceScore(node, preferenceTerms);
            // Rough distance estimate
            const dLat = (node.lat - lat) * 111;
            const dLon = (node.lon - lon) * 111 * Math.cos((lat * Math.PI) / 180);
            const distKm = Math.sqrt(dLat * dLat + dLon * dLon);
            return {
                node,
                prefScore,
                distKm: parseFloat(distKm.toFixed(2)),
            };
        });
        // Sort: places with matching preferences first, then by proximity
        scoredNodes.sort((a, b) => {
            if (b.prefScore !== a.prefScore) {
                return b.prefScore - a.prefScore; // Highest preference boost first
            }
            return a.distKm - b.distKm; // Closer first
        });
        // If no spots match: return HTTP 404 with explicit, readable error message
        if (scoredNodes.length === 0) {
            const displayLocation = locationLabel.split(',')[0].trim();
            const displayMood = normalizedMood.charAt(0).toUpperCase() + normalizedMood.slice(1);
            return res.status(404).json({
                error: `No places found matching location '${displayLocation}', time '${timeConfig.label}', and mood '${displayMood}'. Try broadening your search or time window.`,
            });
        }
        // Take top candidates
        const topCandidates = scoredNodes.slice(0, 24);
        // 6. Real-Time Dynamic Image Resolution Pipeline
        const formattedPlaces = await Promise.all(topCandidates.map(async ({ node, prefScore, distKm }) => {
            const primaryCategory = node.tags.amenity ||
                node.tags.tourism ||
                node.tags.leisure ||
                node.tags.historic ||
                node.tags.craft ||
                node.tags.shop ||
                normalizedMood;
            const placeName = node.tags.name || node.tags['name:en'] || 'Local Destination';
            const rating = Math.min(5.0, parseFloat((4.0 + ((node.id % 10) / 10)).toFixed(1)));
            const reviewCount = (node.id % 450) + 25;
            // Resolve real dynamic place image asynchronously
            const image = await (0, exports.fetchRealPlaceImage)(placeName, primaryCategory, node.tags, node.id, locationLabel.split(',')[0].trim());
            const matchScore = Math.min(99, Math.max(75, 80 + prefScore + (node.id % 10)));
            const matchReason = prefScore > 0
                ? `Matches your ${normalizedMood} vibe and caters directly to your preference for "${rawPreferences.trim()}".`
                : `Selected as a top authentic ${primaryCategory.replace(/_/g, ' ')} match within your ${timeConfig.label} window.`;
            const description = node.tags.description ||
                `${placeName} is a popular ${primaryCategory.replace(/_/g, ' ')} spot, ideal for a ${normalizedMood} experience.`;
            const nodeLat = Number(node.lat);
            const nodeLng = Number(node.lon);
            return {
                id: node.id.toString(),
                name: placeName,
                category: primaryCategory.replace(/_/g, ' '),
                categoryEmoji: getCategoryEmoji(primaryCategory),
                rating,
                reviewCount,
                distance: `${distKm} km away`,
                visitDuration: timeConfig.label,
                image,
                imageUrl: image, // Dual key for backwards compatibility
                bestFor: [normalizedMood, primaryCategory.replace(/_/g, ' '), ...(prefScore > 0 ? preferenceTerms : [])].filter(Boolean),
                matchScore,
                matchReason,
                latitude: nodeLat,
                longitude: nodeLng,
                coordinates: {
                    lat: nodeLat,
                    lng: nodeLng,
                    x: nodeLng,
                    y: nodeLat,
                    label: placeName,
                },
                description,
            };
        }));
        return res.json({ places: formattedPlaces });
    }
    catch (error) {
        console.error('Recommendation error:', error);
        if (error.isUpstream || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return res.status(503).json({
                error: 'The OpenStreetMap Overpass service timed out or is temporarily unreachable. Please try again in a few moments.',
            });
        }
        return res.status(500).json({
            error: 'An unexpected error occurred while retrieving recommendations. Please try again.',
        });
    }
};
exports.getRecommendations = getRecommendations;
/**
 * Helper to get a suitable emoji for category
 */
const getCategoryEmoji = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('cafe') || cat.includes('tea'))
        return '☕';
    if (cat.includes('restaurant') || cat.includes('food') || cat.includes('bakery'))
        return '🍽️';
    if (cat.includes('park') || cat.includes('garden') || cat.includes('nature'))
        return '🌿';
    if (cat.includes('museum') || cat.includes('gallery') || cat.includes('historic') || cat.includes('monument'))
        return '🏛️';
    if (cat.includes('theatre') || cat.includes('arts') || cat.includes('cinema'))
        return '🎭';
    if (cat.includes('sports') || cat.includes('playground') || cat.includes('pitch'))
        return '⚡';
    if (cat.includes('viewpoint') || cat.includes('attraction'))
        return '🧭';
    if (cat.includes('spa') || cat.includes('library'))
        return '🍃';
    return '📍';
};
