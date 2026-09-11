export function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-[#EAF3E8] text-[#2A5C23] border-[#C8E0C4]"
      : score >= 80
        ? "bg-[#EEF3EA] text-[#3D7234] border-[#D4E8CF]"
        : "bg-secondary text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-semibold tracking-wide border ${color}`}
    >
      {score}% match
    </span>
  );
}
