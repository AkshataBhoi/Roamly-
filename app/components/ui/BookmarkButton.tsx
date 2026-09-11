export function BookmarkButton({
  saved,
  onToggle,
}: {
  saved: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={saved ? "Remove from saved" : "Save place"}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
        saved
          ? "bg-primary text-primary-foreground hover:bg-accent"
          : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 2h8a1 1 0 011 1v8.5l-5-3-5 3V3a1 1 0 011-1z" />
      </svg>
    </button>
  );
}
