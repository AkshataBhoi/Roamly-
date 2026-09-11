export function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-[#EAF3E8] text-[#2A5C23]"
      : score >= 80
        ? "bg-[#EEF3EA] text-[#3D7234]"
        : "bg-secondary text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-semibold tracking-wide ${color}`}
    >
      {score}% match
    </span>
  );
}
