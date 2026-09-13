export function MatchBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
      ⚡ {score}% Match
    </span>
  );
}
