import { useState } from "react";
import { Place } from "../types";
import { BookmarkButton } from "./ui/BookmarkButton";
import { MatchBadge } from "./ui/MatchBadge";
import { StarRating } from "./ui/StarRating";
import MapViewWrapper from "./MapViewWrapper";

interface DetailScreenProps {
  place: Place;
  saved: boolean;
  onToggleSave: () => void;
  onBack: () => void;
}

export function DetailScreen({
  place,
  saved,
  onToggleSave,
  onBack,
}: DetailScreenProps) {
  const [mapsClicked, setMapsClicked] = useState(false);

  // Safely extract destination latitude/longitude with fallbacks for all interface structures
  const getDestinationCoords = () => {
    const lat =
      (place as any).latitude ??
      place.coordinates?.x ??
      place.coordinates?.y ??
      12.9716;
    const lng =
      (place as any).longitude ??
      place.coordinates?.y ??
      place.coordinates?.x ??
      77.5946;
    return { lat, lng };
  };

  const handleLaunchGoogleMaps = async () => {
    setMapsClicked(true);
    const { lat: destLat, lng: destLng } = getDestinationCoords();
    const encodedName = encodeURIComponent(place.name || "Destination");

    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const originLat = pos.coords.latitude;
            const originLng = pos.coords.longitude;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&destination_place_id=${encodedName}`;
            window.open(url, "_blank", "noopener,noreferrer");
          },
          () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
            window.open(url, "_blank", "noopener,noreferrer");
          }
        );
      } else {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedName}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setTimeout(() => setMapsClicked(false), 2500);
  };

  return (
    <main className="w-full max-w-full overflow-x-hidden flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[13px] font-bold text-white/70 hover:text-emerald-400 transition-colors cursor-pointer group px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-emerald-500/30"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Radar</span>
          </button>

          <div className="flex items-center gap-2">
            <BookmarkButton saved={saved} onToggle={onToggleSave} />
            {place.matchScore ? <MatchBadge score={place.matchScore} /> : null}
          </div>
        </div>

        {/* Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Hero Photographic Banner & Compact Map */}
          <div className="lg:col-span-5 space-y-4">
            {/* Image Container */}
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-zinc-950 border border-white/15 shadow-lg group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={place.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&fit=crop&auto=format"}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&fit=crop&auto=format";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold flex items-center gap-1.5">
                <span>{place.categoryEmoji || "📍"}</span>
                <span>{place.category}</span>
              </span>
            </div>

            {/* Compact Map Preview */}
            <div className="rounded-2xl overflow-hidden border border-white/15 shadow-lg h-48 relative">
              <MapViewWrapper place={place} zoom={15} />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-white/70 flex justify-between items-center pointer-events-none">
                <span>Live Map Preview</span>
                <span className="text-emerald-400 font-mono font-bold">{place.distance || "Nearby"}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Metadata, AI Reason Breakdown & Actions */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Header Box */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <h1
                className="text-[26px] sm:text-[32px] font-black text-white leading-snug tracking-tight mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {place.name}
              </h1>

              {/* Quick Meta Row */}
              <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-white/70 mb-3">
                {place.rating ? (
                  <div className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <StarRating rating={place.rating} />
                  </div>
                ) : null}
                {place.distance ? (
                  <span className="font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    📍 {place.distance} away
                  </span>
                ) : null}
                {place.visitDuration ? (
                  <span className="text-white/80 font-medium bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/10">
                    ⏱️ {place.visitDuration}
                  </span>
                ) : null}
              </div>

              {/* Description */}
              <p className="text-[14px] sm:text-[15px] text-white/80 leading-relaxed font-normal">
                {place.description}
              </p>
            </div>

            {/* Why Roamly Recommends Card */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-extrabold tracking-widest uppercase mb-1.5">
                <span>⚡ AI Recommendation Reason</span>
              </div>
              <p className="text-[14px] text-white font-medium leading-normal mb-2">
                &ldquo;{place.matchReason ? place.matchReason.charAt(0).toUpperCase() + place.matchReason.slice(1) : "Selected directly for your current vibe."}&rdquo;
              </p>
              
              {place.matchScore ? (
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
                    style={{ width: `${place.matchScore}%` }}
                  />
                </div>
              ) : null}
            </div>

            {/* Ideal For Badges */}
            {place.bestFor && place.bestFor.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-2">
                  Ideal For
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {place.bestFor.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[12px] font-bold text-white/90"
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleLaunchGoogleMaps}
                className={`flex-1 py-3.5 px-6 rounded-xl text-[14px] font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                  mapsClicked
                    ? "bg-white text-black border border-white"
                    : "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 text-emerald-950 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                }`}
              >
                {mapsClicked ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Launching Maps Navigation...</span>
                  </>
                ) : (
                  <>
                    <span>Open in Google Maps</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleSave}
                className={`px-5 py-3.5 rounded-xl text-[14px] font-extrabold border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  saved
                    ? "bg-amber-400 text-black border-amber-300 shadow-md"
                    : "bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.12]"
                }`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>{saved ? "Saved" : "Save Place"}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}