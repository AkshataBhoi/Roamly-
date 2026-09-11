import { useState } from "react";
import { Place } from "../types";
import { BookmarkButton } from "./ui/BookmarkButton";
import { MatchBadge } from "./ui/MatchBadge";
import { StarRating } from "./ui/StarRating";

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

  function handleOpenMaps() {
    setMapsClicked(true);
    const query = encodeURIComponent(`${place.name} ${place.locationHint || "Bengaluru"}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
    setTimeout(() => setMapsClicked(false), 3000);
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-10">
        {/* Back navigation */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 2L4 7l5 5" />
          </svg>
          <span>Back to results</span>
        </button>

        {/* Hero Image Card */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-muted mb-6 shadow-xs border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-4 right-4">
            <BookmarkButton saved={saved} onToggle={onToggleSave} />
          </div>
          <div className="absolute bottom-4 left-4">
            <MatchBadge score={place.matchScore} />
          </div>
        </div>

        {/* Title and Meta */}
        <h1
          className="text-[28px] md:text-[32px] font-semibold text-foreground leading-tight tracking-[-0.5px] mb-1.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {place.name}
        </h1>

        <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-5 flex-wrap">
          <span className="flex items-center gap-1">
            <span>{place.categoryEmoji}</span>
            <span>{place.category}</span>
          </span>
          <span>&middot;</span>
          <StarRating rating={place.rating} />
          <span>&middot;</span>
          <span>{place.distance} away</span>
          {place.locationHint && (
            <>
              <span>&middot;</span>
              <span>{place.locationHint}</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-[15px] text-foreground/85 leading-relaxed mb-8">
          {place.description}
        </p>

        <div className="space-y-4">
          {/* Section: Why Roamly recommends it */}
          <div className="bg-[#EAF3E8] border border-[#C8E0C4] rounded-xl p-5 shadow-xs">
            <h2
              className="text-[13px] font-semibold text-primary mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why Roamly recommends it
            </h2>
            <p className="text-[14px] text-foreground/85 leading-relaxed">
              {place.matchReason.charAt(0).toUpperCase() +
                place.matchReason.slice(1)}{" "}
              With a{" "}
              <span className="font-semibold text-primary">
                {place.matchScore}% match score
              </span>
              , this is one of the top recommendations for your current situation.
            </p>
          </div>

          {/* Section: Good to know */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h2
              className="text-[13px] font-semibold text-foreground mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Good to know
            </h2>
            <dl className="space-y-2.5">
              {[
                { label: "Estimated visit", value: place.visitDuration },
                { label: "Distance", value: `${place.distance} away` },
                { label: "Best for", value: place.bestFor.join(", ") },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-[13px] border-b border-border/50 pb-2 last:border-b-0 last:pb-0"
                >
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="font-medium text-foreground text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleOpenMaps}
            className={`flex-1 py-3 px-5 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              mapsClicked
                ? "bg-secondary text-foreground border border-border"
                : "bg-primary text-primary-foreground hover:bg-accent"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {mapsClicked ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 7l4 4 6-6" />
                </svg>
                <span>Opened in Google Maps</span>
              </>
            ) : (
              <>
                <span>Open in Google Maps</span>
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
                  <path d="M2 10L10 2M10 2H5M10 2v5" />
                </svg>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleSave}
            className={`flex-1 sm:flex-none sm:px-6 py-3 rounded-xl text-[14px] font-semibold border transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              saved
                ? "bg-secondary text-foreground border-border"
                : "border-border text-foreground hover:bg-secondary bg-card"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {saved ? "Saved ✓" : "Save place"}
          </button>
        </div>
      </div>
    </main>
  );
}
