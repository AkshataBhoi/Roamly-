import { Place } from "../types";
import { PlaceCard } from "./PlaceCard";

interface SavedScreenProps {
  savedPlaces: Place[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onPlaceClick: (place: Place) => void;
}

export function SavedScreen({
  savedPlaces,
  onToggleSave,
  onPlaceClick,
}: SavedScreenProps) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-widest text-accent uppercase mb-2">
            Your collection
          </p>
          <h2
            className="text-[28px] md:text-[34px] font-semibold text-foreground leading-tight tracking-[-0.5px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your saved places
          </h2>
          <p className="text-[14px] text-muted-foreground mt-1.5">
            Places you might want to visit later.
          </p>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="#76746F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 3h12a1 1 0 011 1v14l-7-4-7 4V4a1 1 0 011-1z" />
              </svg>
            </div>
            <h3
              className="text-[16px] font-semibold text-foreground mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No saved places yet.
            </h3>
            <p className="text-[14px] text-muted-foreground max-w-xs">
              Save places you want to come back to. They&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                saved={true}
                onSave={() => onToggleSave(place.id)}
                onClick={() => onPlaceClick(place)}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
