import { useState } from "react";
import { Screen } from "../types";
import { RoamlyLogo } from "./ui/RoamlyLogo";

interface HeaderProps {
  activeScreen: Screen;
  onNavigate: (s: Screen) => void;
}

export function Header({ activeScreen, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen: Screen) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  const navItems: { label: string; screen: Screen; icon: string }[] = [
    { label: "Explore", screen: "home", icon: "🧭" },
    { label: "My Story", screen: "story", icon: "✨" },
    { label: "Places", screen: "results", icon: "📍" },
    { label: "Saved", screen: "saved", icon: "🔖" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 transition-colors w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("home")}
          className="focus:outline-none cursor-pointer shrink-0"
          aria-label="Roamly Home"
        >
          <RoamlyLogo />
        </button>

        {/* Desktop Navigation Pill Bar */}
        <nav
          className="hidden md:flex items-center gap-1.5 p-1.5 bg-white/[0.06] rounded-full border border-white/10 backdrop-blur-md shadow-inner"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive =
              activeScreen === item.screen ||
              (item.screen === "results" && activeScreen === "detail");
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => handleNavClick(item.screen)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "text-emerald-950 bg-emerald-400 font-bold shadow-md shadow-emerald-500/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Status Indicator & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Radar Active Badge (Desktop / Tablet) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-400 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase text-[10px]">Radar Active</span>
          </div>

          {/* Quick Saved icon shortcut on mobile viewports */}
          <button
            type="button"
            onClick={() => handleNavClick("saved")}
            className="md:hidden p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Saved Places"
          >
            <span className="text-[16px]">🔖</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          {/* User Profile Emblem */}
          <div className="hidden sm:flex w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 border border-white/20 items-center justify-center select-none text-[13px] font-extrabold text-emerald-950 shadow-md shrink-0">
            R
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive =
                activeScreen === item.screen ||
                (item.screen === "results" && activeScreen === "detail");
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => handleNavClick(item.screen)}
                  className={`p-3 rounded-xl text-[14px] font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? "bg-emerald-400 text-emerald-950 border-emerald-300 shadow-md"
                      : "bg-white/[0.04] text-white/80 border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  <span className="text-[16px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-white/50 px-1 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live GPS Radar Active
            </span>
            <span>Roamly v1.0</span>
          </div>
        </div>
      )}
    </header>
  );
}
