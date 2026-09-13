import { useState, useMemo } from "react";
import { Place } from "../types";
import { PlaceCard } from "./PlaceCard";

interface ResultsScreenProps {
  selectedLocation: string;
  selectedTime: string;
  selectedMood: string;
  places: Place[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onPlaceClick: (place: Place) => void;
  onEditPreferences: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function ResultsScreen({
  selectedLocation,
  selectedTime,
  selectedMood,
  places,
  savedIds,
  onToggleSave,
  onPlaceClick,
  onEditPreferences,
  isLoading = false,
  errorMessage,
}: ResultsScreenProps) {
  // Grid column count state: 3-column (default) or 4-column
  const [gridColumns, setGridColumns] = useState<3 | 4>(3);

  // Pagination state: display initial slice of 6 places
  const INITIAL_COUNT = 6;
  const PAGE_INCREMENT = 6;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  // Strict Category / Mood Filtering
  // Only display places matching the selected mood / category, filtering out irrelevant locations
  const filteredPlaces = useMemo(() => {
    if (!selectedMood) return places;
    const target = selectedMood.toLowerCase().trim();

    return places.filter((place) => {
      const cat = (place.category || "").toLowerCase();
      const desc = (place.description || "").toLowerCase();
      const best = (place.bestFor || []).map((b) => b.toLowerCase());
      const reason = (place.matchReason || "").toLowerCase();

      // Mood keyword matching dictionary for strict relevance
      const moodMap: Record<string, string[]> = {
        relax: ["relax", "nature", "park", "garden", "quiet", "calm", "serene", "peaceful", "spa", "library", "coffee", "tea"],
        explore: ["explore", "walk", "street", "indie", "market", "view", "wander", "bookshop", "hidden"],
        nature: ["nature", "park", "garden", "botanical", "forest", "tree", "lake", "green", "outdoor", "trail"],
        food: ["food", "restaurant", "cafe", "street food", "dosa", "snack", "bakery", "dinner", "culinary", "delicacy"],
        adventure: ["adventure", "theme_park", "hiking", "sports", "action", "outdoor", "thrill", "trail", "active"],
        culture: ["culture", "palace", "museum", "gallery", "heritage", "historic", "art", "theatre", "monument", "architecture"],
      };

      const validKeywords = moodMap[target] || [target];

      // Verify category, bestFor tags, description, or matchReason aligns with mood
      const matchesCategory = validKeywords.some((kw) => cat.includes(kw));
      const matchesBestFor = best.some((b) => validKeywords.some((kw) => b.includes(kw)));
      const matchesDesc = validKeywords.some((kw) => desc.includes(kw));
      const matchesReason = validKeywords.some((kw) => reason.includes(kw));

      return matchesCategory || matchesBestFor || matchesDesc || matchesReason;
    });
  }, [places, selectedMood]);

  // Paginated slice
  const displayedPlaces = useMemo(() => {
    return filteredPlaces.slice(0, visibleCount);
  }, [filteredPlaces, visibleCount]);

  const hasMorePlaces = visibleCount < filteredPlaces.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_INCREMENT, filteredPlaces.length));
  };

  return (
    <main className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-7xl mx-auto">
        {/* Top Header & Filtering Summary Bar */}
        <div className="mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Strict Category Radar Active</span>
            </div>

            <h1
              className="text-[34px] sm:text-[34px] md:text-[44px] font-black text-white leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curated for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 capitalize">{selectedMood}</span> in{" "}
              <span className="text-white/90">{selectedLocation.split(",")[0]}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-[13px] text-white/60 mt-2 font-medium">
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                ⏱️ Window: {selectedTime}
              </span>
              <span>•</span>
              <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                ✨ Vibe: {selectedMood}
              </span>
              <span>•</span>
              <span>{filteredPlaces.length} authentic matches found</span>
            </div>
          </div>

          {/* Action Toolbar: 3/4 Grid Toggle & Edit Criteria */}
          <div className="flex items-center gap-3">
            {/* Grid Toggle: 3 Columns vs 4 Columns (Desktop) */}
            <div className="hidden lg:flex items-center p-1 bg-white/[0.06] border border-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => setGridColumns(3)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  gridColumns === 3
                    ? "bg-emerald-400 text-emerald-950 shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
                title="3-Column Grid"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="5" height="20" rx="1" />
                  <rect x="9.5" y="2" width="5" height="20" rx="1" />
                  <rect x="17" y="2" width="5" height="20" rx="1" />
                </svg>
                <span>3 Col</span>
              </button>

              <button
                type="button"
                onClick={() => setGridColumns(4)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  gridColumns === 4
                    ? "bg-emerald-400 text-emerald-950 shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
                title="4-Column Grid"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="3.8" height="20" rx="1" />
                  <rect x="7.4" y="2" width="3.8" height="20" rx="1" />
                  <rect x="12.8" y="2" width="3.8" height="20" rx="1" />
                  <rect x="18.2" y="2" width="3.8" height="20" rx="1" />
                </svg>
                <span>4 Col</span>
              </button>
            </div>

            {/* Edit Preferences Button */}
            <button
              type="button"
              onClick={onEditPreferences}
              className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/[0.08] hover:bg-white/[0.15] text-[13px] font-bold text-white transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Criteria</span>
            </button>
          </div>
        </div>

        {/* Dynamic Loading State */}
        {isLoading ? (
          <div className="py-28 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
            <h3 className="text-[22px] font-extrabold text-white mb-2">
              Triangulating Best Spots...
            </h3>
            <p className="text-[15px] text-white/60 max-w-md">
              Filtering strict {selectedMood.toLowerCase()} opportunities within {selectedTime} around {selectedLocation}.
            </p>
          </div>
        ) : filteredPlaces.length === 0 ? (
          /* Empty / Explicit Error State */
          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 md:p-14 text-center max-w-xl mx-auto my-12 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-[28px] shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              🧭
            </div>
            <h3
              className="text-[22px] sm:text-[24px] font-black text-white mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {errorMessage ? "Search Alert" : `No strictly matching ${selectedMood} spots`}
            </h3>
            <p className="text-[14px] text-white/70 leading-relaxed mb-6 font-medium">
              {errorMessage ||
                `Our strict category filter found no spots matching "${selectedMood}". Try widening your available time window or adjusting your filters.`}
            </p>
            <button
              type="button"
              onClick={onEditPreferences}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-950 text-[14px] font-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              Adjust Scene Setter
            </button>
          </div>
        ) : (
          /* Full Edge-to-Edge Dynamic Grid with Pagination */
          <div className="space-y-10">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                gridColumns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              } gap-6`}
            >
              {displayedPlaces.map((place, i) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  rank={i + 1}
                  saved={savedIds.has(place.id)}
                  onSave={() => onToggleSave(place.id)}
                  onClick={() => onPlaceClick(place)}
                />
              ))}
            </div>

            {/* Pagination Controls / View More Button */}
            {hasMorePlaces && (
              <div className="flex flex-col items-center justify-center pt-4 pb-8 space-y-3">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-4 rounded-2xl bg-white/[0.08] hover:bg-emerald-500 hover:text-emerald-950 text-white font-extrabold text-[14px] border border-white/15 hover:border-emerald-400 transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] active:scale-95 group"
                >
                  <span>View More Places</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-y-0.5 transition-transform"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <p className="text-[12px] text-white/40 font-medium">
                  Showing {displayedPlaces.length} of {filteredPlaces.length} curated destinations
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}