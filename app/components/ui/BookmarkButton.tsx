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
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md border hover:scale-110 active:scale-90 ${
        saved
          ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          : "bg-black/50 text-white/80 border-white/20 hover:bg-black/80 hover:text-white"
      }`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
