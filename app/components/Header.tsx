import { Screen } from "../types";
import { RoamlyLogo } from "./ui/RoamlyLogo";

interface HeaderProps {
  activeScreen: Screen;
  onNavigate: (s: Screen) => void;
  savedCount?: number;
}

export function Header({ activeScreen, onNavigate, savedCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="focus:outline-none cursor-pointer"
          aria-label="Roamly Home"
        >
          <RoamlyLogo />
        </button>

        <nav className="flex items-center gap-1.5" aria-label="Main Navigation">
          <button
            type="button"
            onClick={() => onNavigate("results")}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              activeScreen === "results" || activeScreen === "detail"
                ? "text-foreground bg-secondary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            Explore
          </button>
          <button
            type="button"
            onClick={() => onNavigate("saved")}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeScreen === "saved"
                ? "text-foreground bg-secondary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        <div
          className="w-8 h-8 rounded-full bg-[#D4E8CF] border border-[#BDE0B5] flex items-center justify-center select-none"
          title="User Profile"
        >
          <span
            className="text-[12px] font-semibold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A
          </span>
        </div>
      </div>
    </header>
  );
}
