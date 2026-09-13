interface HomeScreenProps {
  onStartExploring: () => void;
}

export function HomeScreen({ onStartExploring }: HomeScreenProps) {
  return (
    <main className="relative h-[calc(100vh-4.5rem)] w-full overflow-hidden flex items-center justify-center select-none">
      {/* 1. Full-Screen Atmospheric Background Image & Gradient Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.avif"
          alt="Adventure Atmospheric Landscape"
          className="w-full h-full object-cover scale-105 filter brightness-90 contrast-105 transition-transform duration-1000 ease-out"
          onError={(e) => {
            // Graceful fallback to dark atmospheric gradient if image fails
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-radial from-emerald-950/40 via-zinc-950/80 to-black" />
      </div>

      {/* 2. Layered Vignettes & Radial Dynamic Glow */}
      <div className="absolute inset-0 -z-10 bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-black/80 pointer-events-none" />

      {/* 3. Hero Content: Headline & Single High-Impact CTA */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 md:px-8 text-center flex flex-col items-center justify-center">
        {/* Adventure Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-emerald-400 text-[11px] sm:text-[12px] font-bold tracking-widest uppercase mb-6 sm:mb-8 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Smart Local Adventure Engine</span>
        </div>

        {/* High-Contrast Hero Headline */}
        <h1
          className="text-[38px] sm:text-[64px] md:text-[88px] font-black tracking-tight leading-[1.05] text-white drop-shadow-2xl mb-6 sm:mb-8 max-w-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          And so the adventure{" "}
          <span className="italic font-normal block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
            begins...
          </span>
        </h1>

        {/* Narrative Subtitle */}
        <p className="text-[15px] sm:text-[19px] md:text-[21px] text-white/85 max-w-2xl font-light leading-relaxed mb-8 sm:mb-12 drop-shadow-md px-2">
          Discover handpicked local spots synchronized directly with your real location, available window of time, and mood.
        </p>

        {/* SINGLE Action Button redirecting to /story */}
        <button
          type="button"
          onClick={onStartExploring}
          className="px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 text-emerald-950 font-black text-[15px] sm:text-[17px] tracking-wide shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:shadow-[0_0_60px_rgba(16,185,129,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3 group border border-emerald-300/60"
        >
          <span>Start Exploring</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1.5 transition-transform"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </main>
  );
}