export type Screen = "home" | "results" | "detail" | "saved";

export interface Place {
  id: string;
  name: string;
  category: string;
  categoryEmoji: string;
  rating: number;
  distance: string;
  visitDuration: string;
  description: string;
  matchScore: number;
  matchReason: string;
  image: string;
  bestFor: string[];
  locationHint?: string;
  coordinates?: {
    x: number;
    y: number;
    label: string;
  };
}

export interface RecommendationQuery {
  location: string;
  time: string;
  mood: string;
  preferenceText: string;
}
