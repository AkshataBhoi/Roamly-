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
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-foreground/20 hover:shadow-sm transition-all group flex flex-col justify-between"
    >
      <div>
        {/* Card Image Header */}
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
            <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-background/90 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <span className="text-[11px] font-semibold text-foreground">
                {rank}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <BookmarkButton saved={saved} onToggle={onSave} />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0 pr-1">
              <h3
                className="text-[15px] font-semibold text-foreground leading-tight truncate"
                style={{ fontFamily: "var(--font-display)" }}
                title={place.name}
              >
                {place.name}
              </h3>
              <p className="text-[12px] text-muted-foreground mt-0.5 flex items-center flex-wrap gap-1">
                <span>{place.categoryEmoji}</span>
                <span>{place.category}</span>
                <span>&middot;</span>
                <StarRating rating={place.rating} />
                <span>&middot;</span>
                <span>{place.distance}</span>
              </p>
            </div>
            <div className="shrink-0">
              <MatchBadge score={place.matchScore} />
            </div>
          </div>

          <p className="text-[13px] text-muted-foreground leading-relaxed mt-2 line-clamp-2">
            {place.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4">
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <span className="text-[12px] text-muted-foreground shrink-0">
            {place.visitDuration} visit
          </span>
          <p
            className="text-[12px] text-muted-foreground italic truncate text-right max-w-[170px]"
            title={place.matchReason}
          >
            &ldquo;{place.matchReason}&rdquo;
          </p>
        </div>
      </div>
    </article>
  );
}
