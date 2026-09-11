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
  return (
    <article
      onClick={onClick}
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-foreground/20 hover:shadow-sm transition-all group"
    >
      <div
        className={`relative ${
          compact ? "h-36" : "h-44"
        } bg-muted overflow-hidden`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        {rank !== undefined && (
          <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-background/90 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-foreground">
              {rank}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <BookmarkButton saved={saved} onToggle={onSave} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3
              className="text-[15px] font-semibold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {place.name}
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {place.categoryEmoji} {place.category} &middot;{" "}
              <StarRating rating={place.rating} /> &middot; {place.distance}
            </p>
          </div>
          <MatchBadge score={place.matchScore} />
        </div>

        <p className="text-[13px] text-muted-foreground leading-relaxed mt-2 line-clamp-2">
          {place.description}
        </p>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">
            {place.visitDuration} visit
          </span>
          <p className="text-[12px] text-muted-foreground italic max-w-[180px] truncate">
            &ldquo;{place.matchReason}&rdquo;
          </p>
        </div>
      </div>
    </article>
  );
}
