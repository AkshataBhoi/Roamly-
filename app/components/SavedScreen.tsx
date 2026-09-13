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
    <main className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Saved Adventure Vault</span>
          </div>
          <h1
            className="text-[34px] sm:text-[46px] font-black text-white leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Collection</span>
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/60 mt-2 font-medium">
            {savedPlaces.length} {savedPlaces.length === 1 ? "spot" : "spots"} earmarked for future journeys and spontaneous wanders.
          </p>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-12 md:p-16 text-center max-w-xl mx-auto my-12 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-[26px]">
              📌
            </div>
            <h3
              className="text-[22px] font-black text-white mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No saved adventures yet.
            </h3>
            <p className="text-[14px] text-white/60 leading-relaxed max-w-sm mx-auto">
              Whenever you encounter a café, urban park, or cultural spot you love, tap the bookmark icon to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
