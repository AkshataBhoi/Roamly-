export function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="#2A5C23"
        aria-hidden="true"
      >
        <path d="M6 1l1.3 3.9H11L8.1 7.3l1 3.8L6 8.9l-3.1 2.2 1-3.8L1 4.9h3.7z" />
      </svg>
      <span className="text-[13px] font-medium text-foreground">{rating}</span>
    </span>
  );
}
