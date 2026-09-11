import { Place } from "../types";
import { MapPlaceholder } from "./MapPlaceholder";
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
}

export function ResultsScreen({
  selectedTime,
  selectedMood,
  places,
  savedIds,
  onToggleSave,
  onPlaceClick,
  onEditPreferences,
}: ResultsScreenProps) {
  const meta = [selectedTime, selectedMood, "Near Bengaluru"]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        {/* Top section */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-accent uppercase mb-2">
              Based on your preferences
            </p>
            <h2
              className="text-[28px] md:text-[34px] font-semibold text-foreground leading-tight tracking-[-0.5px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Places worth your time.
            </h2>
            <p className="text-[14px] text-muted-foreground mt-1.5">{meta}</p>
          </div>
          <button
            type="button"
            onClick={onEditPreferences}
            className="shrink-0 mt-1 px-4 py-2 rounded-lg border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 1.5l2 2-6 6H2.5v-2l6-6z" />
            </svg>
            Edit
          </button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places.map((place, i) => (
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

          {/* Map */}
          <div className="lg:sticky lg:top-[80px]">
            <div className="h-[400px] lg:h-[520px]">
              <MapPlaceholder />
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-2.5">
              Approximate distances from your location
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
