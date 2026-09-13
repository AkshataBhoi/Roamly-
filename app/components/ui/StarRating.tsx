export function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-[13px] font-extrabold text-amber-300 font-mono">{rating.toFixed(1)}</span>
    </span>
  );
}
