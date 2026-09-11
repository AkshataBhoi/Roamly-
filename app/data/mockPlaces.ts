import { Place } from "../types";

export const PLACES: Place[] = [
  {
    id: "cubbon",
    name: "Cubbon Park",
    category: "Nature",
    categoryEmoji: "🌿",
    rating: 4.6,
    distance: "2.1 km",
    visitDuration: "~1.5 hr",
    description:
      "A serene 300-acre urban forest at the heart of Bengaluru. Shaded walking paths, open lawns, and a calm that feels rare for a city this size.",
    matchScore: 94,
    matchReason:
      "Fits your 2-hour window and matches your preference for a relaxing experience.",
    image:
      "https://images.unsplash.com/photo-1632214921221-bac4ed6328cf?w=800&h=500&fit=crop&auto=format",
    bestFor: ["Relaxing", "Walking", "Nature"],
    locationHint: "Near Kasturba Road, Bengaluru",
    coordinates: { x: 38, y: 44, label: "Cubbon" },
  },
  {
    id: "lalbagh",
    name: "Lalbagh Botanical Garden",
    category: "Nature",
    categoryEmoji: "🌸",
    rating: 4.5,
    distance: "3.4 km",
    visitDuration: "~2 hr",
    description:
      "Over 1,800 plant species spread across 240 acres, anchored by a Victorian glasshouse. One of the finest botanical gardens in South Asia.",
    matchScore: 89,
    matchReason:
      "Its gentle pace and natural beauty suit your mood, and it fits comfortably within your available time.",
    image:
      "https://images.unsplash.com/photo-1786051432648-ac44046f2a03?w=800&h=500&fit=crop&auto=format",
    bestFor: ["Nature", "Photography", "Walking"],
    locationHint: "Mavalli, Bengaluru",
    coordinates: { x: 55, y: 65, label: "Lalbagh" },
  },
  {
    id: "palace",
    name: "Bangalore Palace",
    category: "Culture",
    categoryEmoji: "🏛️",
    rating: 4.4,
    distance: "4.2 km",
    visitDuration: "~1.5 hr",
    description:
      "A 19th-century Tudor-style palace with ornate woodwork, hand-painted walls, and well-kept grounds. An underrated gem in the city.",
    matchScore: 84,
    matchReason:
      "A calm cultural experience within your window — engaging without being overwhelming.",
    image:
      "https://images.unsplash.com/photo-1659126574791-13313aa424bd?w=800&h=500&fit=crop&auto=format",
    bestFor: ["Culture", "History", "Photography"],
    locationHint: "Vasanth Nagar, Bengaluru",
    coordinates: { x: 62, y: 35, label: "Palace" },
  },
  {
    id: "church-street",
    name: "Church Street",
    category: "Explore",
    categoryEmoji: "☕",
    rating: 4.5,
    distance: "3.0 km",
    visitDuration: "~1 hr",
    description:
      "A pedestrian-friendly stretch lined with indie cafes, bookshops, and street food. Perfect for a relaxed wander or coffee and conversation.",
    matchScore: 79,
    matchReason:
      "A shorter outing with plenty to discover at your own pace — and close enough to be effortless.",
    image:
      "https://images.unsplash.com/photo-1760262491926-3e3a85f4b26c?w=800&h=500&fit=crop&auto=format",
    bestFor: ["Exploring", "Food & Coffee", "Shopping"],
    locationHint: "Shanthala Nagar, Bengaluru",
    coordinates: { x: 48, y: 55, label: "Church St" },
  },
  {
    id: "ngma",
    name: "National Gallery of Modern Art",
    category: "Culture",
    categoryEmoji: "🎨",
    rating: 4.6,
    distance: "2.8 km",
    visitDuration: "~1.5 hr",
    description:
      "Set in a heritage mansion with reflecting pools, lush gardens, and historic artwork. Houses a delightful garden café.",
    matchScore: 88,
    matchReason:
      "Quiet, enriching cultural escape close to the city center that fits seamlessly in your schedule.",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&h=500&fit=crop&auto=format",
    bestFor: ["Art", "Architecture", "Quiet"],
    locationHint: "Palace Road, Bengaluru",
    coordinates: { x: 42, y: 38, label: "NGMA" },
  },
  {
    id: "vv-puram",
    name: "VV Puram Food Street",
    category: "Food",
    categoryEmoji: "🥟",
    rating: 4.5,
    distance: "3.8 km",
    visitDuration: "~1 hr",
    description:
      "A legendary street-food destination buzzing with dosas, paddus, rasgulla chaat, and local hot delicacies.",
    matchScore: 91,
    matchReason:
      "Ideal for quick food exploration with diverse tastes within an hour.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=500&fit=crop&auto=format",
    bestFor: ["Street Food", "Evening Walk", "Local Flavors"],
    locationHint: "Sajjan Rao Circle, Bengaluru",
    coordinates: { x: 50, y: 70, label: "VV Puram" },
  },
];

export const TIME_OPTIONS = [
  "30 min",
  "1 hour",
  "2 hours",
  "3–4 hours",
  "Half day",
];

export const MOOD_OPTIONS = [
  "Relax",
  "Explore",
  "Nature",
  "Food",
  "Adventure",
  "Culture",
];
