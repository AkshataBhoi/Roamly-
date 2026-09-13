import { Place } from "../types";
import { BookmarkButton } from "./ui/BookmarkButton";
import { MatchBadge } from "./ui/MatchBadge";
import { StarRating } from "./ui/StarRating";

interface PlaceCardProps {
  place: Place;
  rank?: number;
  saved: boolean;
  onSave: () => void;
  onClick: () => void;
  compact?: boolean;
}

export function PlaceCard({
  place,
  rank,
  saved,
  onSave,
  onClick,
  compact = false,
}: PlaceCardProps) {
  const handleOpenGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place.coordinates && place.coordinates.y && place.coordinates.x) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.y},${place.coordinates.x}&destination_place_id=${encodeURIComponent(place.name)}`;
      window.open(url, "_blank");
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + (place.locationHint || ""))}`;
      window.open(url, "_blank");
    }
  };

  return (
    <article
      onClick={onClick}
      className="w-full max-w-full bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-98 transition-all duration-300 group flex flex-col justify-between"
    >
      <div className="w-full">
        {/* Dynamic Place Photo with Vignette Overlays */}
        <div
          className={`relative w-full ${
            compact ? "h-40 sm:h-44" : "h-48 sm:h-52"
          } bg-zinc-900 overflow-hidden`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={place.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=500&fit=crop&auto=format"}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=500&fit=crop&auto=format";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1511] via-transparent to-black/40 pointer-events-none" />

          {/* Rank Badge */}
          {rank !== undefined && (
            <div className="absolute top-3.5 left-3.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
              <span className="text-[12px] font-black text-emerald-400 font-mono">
                #{rank}
              </span>
            </div>
          )}

          {/* Bookmark Action */}
          <div className="absolute top-3.5 right-3.5 z-10">
            <BookmarkButton saved={saved} onToggle={onSave} />
          </div>

          {/* Category Chip */}
          <div className="absolute bottom-3 left-3.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
              <span>{place.categoryEmoji || "📍"}</span>
              <span>{place.category}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3
              className="text-[16px] sm:text-[17px] font-extrabold text-white leading-tight group-hover:text-emerald-400 transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {place.name}
            </h3>
            {place.matchScore ? <MatchBadge score={place.matchScore} /> : null}
          </div>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-white/60 mb-3.5">
            {place.rating ? <StarRating rating={place.rating} /> : null}
            {place.rating && place.distance ? <span className="text-white/30">•</span> : null}
            {place.distance ? (
              <span className="font-semibold text-emerald-400/90 font-mono">
                📍 {place.distance}
              </span>
            ) : null}
            {place.visitDuration ? (
              <>
                <span className="text-white/30">•</span>
                <span className="text-white/70">⏱️ {place.visitDuration}</span>
              </>
            ) : null}
          </div>

          {/* Place Description */}
          <p className="text-[13px] text-white/70 leading-relaxed line-clamp-2 mb-4 font-normal">
            {place.description}
          </p>

          {/* Best For Tags */}
          {place.bestFor && place.bestFor.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {place.bestFor.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Area: AI Reason + Open in Google Maps */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/10 bg-white/[0.02] flex flex-col gap-3">
        {place.matchReason ? (
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase shrink-0 mt-0.5">
              WHY:
            </span>
            <p className="text-[12px] text-white/60 italic line-clamp-2">
              &ldquo;{place.matchReason}&rdquo;
            </p>
          </div>
        ) : null}

        {/* Direction button executing Google Maps Intent URL */}
        <button
          type="button"
          onClick={handleOpenGoogleMaps}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.07] hover:bg-emerald-500 hover:text-emerald-950 text-white font-bold text-[12px] tracking-wide border border-white/15 hover:border-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group/btn"
        >
          <span>Open in Google Maps</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>
    </article>
  );
}
