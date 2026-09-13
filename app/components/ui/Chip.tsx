export function Chip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 rounded-2xl text-[14px] font-semibold tracking-wide transition-all duration-300 cursor-pointer select-none flex items-center gap-2 border hover:scale-[1.03] active:scale-95 ${
        selected
          ? "bg-emerald-500 text-emerald-950 font-bold border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/40"
          : "bg-white/[0.04] text-white/80 border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.08] hover:text-white"
      }`}
    >
      {icon && <span className="text-[16px]">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
