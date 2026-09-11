import { PLACES } from "../data/mockPlaces";
import { Place, RecommendationQuery } from "../types";

export interface IRecommendationService {
  getRecommendations(query: RecommendationQuery): Promise<Place[]>;
  getPlaceById(id: string): Promise<Place | undefined>;
}

class RecommendationService implements IRecommendationService {
  /**
   * Fetches recommended places based on user constraints.
   * This is currently backed by mock data with contextual scoring,
   * ready to be swapped with an API call (e.g. fetch('/api/recommendations', ...)).
   */
  async getRecommendations(query: RecommendationQuery): Promise<Place[]> {
    // Simulate brief network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 80));

    const { mood, time, preferenceText } = query;

    // Filter and score places contextually
    const scoredPlaces = PLACES.map((place) => {
      let score = 75;

      // Category / Mood match boost
      if (
        place.category.toLowerCase() === mood.toLowerCase() ||
        (mood === "Relax" && (place.category === "Nature" || place.bestFor.includes("Relaxing"))) ||
        (mood === "Explore" && (place.category === "Explore" || place.category === "Culture")) ||
        (mood === "Adventure" && (place.category === "Explore" || place.category === "Nature"))
      ) {
        score += 15;
      }

      // Keyword match in preference text
      if (preferenceText && preferenceText.trim().length > 0) {
        const queryTerms = preferenceText.toLowerCase().split(/\s+/);
        const matchFound = queryTerms.some((term) =>
          place.description.toLowerCase().includes(term) ||
          place.name.toLowerCase().includes(term) ||
          place.bestFor.some((b) => b.toLowerCase().includes(term))
        );
        if (matchFound) {
          score += 8;
        }
      }

      // Time compatibility boost
      if (
        (time.includes("30") && place.visitDuration.includes("1 hr")) ||
        (time.includes("1 hour") && (place.visitDuration.includes("1 hr") || place.visitDuration.includes("1.5 hr"))) ||
        (time.includes("2 hours") && (place.visitDuration.includes("1.5 hr") || place.visitDuration.includes("2 hr"))) ||
        (time.includes("3–4") || time.includes("Half day"))
      ) {
        score += 5;
      }

      // Cap between 65% and 98%
      const finalScore = Math.min(Math.max(score, 68), 96);

      let customReason = place.matchReason;
      if (mood && time) {
        customReason = `Fits your ${time} window and matches your preference for a ${mood.toLowerCase()} experience.`;
      }

      return {
        ...place,
        matchScore: finalScore,
        matchReason: customReason,
      };
    });

    // Return sorted by matchScore descending
    return scoredPlaces.sort((a, b) => b.matchScore - a.matchScore);
  }

  async getPlaceById(id: string): Promise<Place | undefined> {
    return PLACES.find((p) => p.id === id);
  }
}

export const recommendationService = new RecommendationService();
