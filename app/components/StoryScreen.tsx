import { useState } from "react";
import { recommendationService } from "../services/recommendationService";

interface StoryScreenProps {
  selectedLocation: string;
  setSelectedLocation: (l: string) => void;
  latitude?: number;
  setLatitude: (lat: number | undefined) => void;
  longitude?: number;
  setLongitude: (lng: number | undefined) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  selectedMood: string;
  setSelectedMood: (m: string) => void;
  preferenceText: string;
  setPreferenceText: (t: string) => void;
  onFindSpot: () => void;
  onBackToHero?: () => void;
}

const TIME_OPTIONS = [
  { label: "30m", desc: "Quick dip" },
  { label: "1h", desc: "Standard pause" },
  { label: "3h", desc: "Sweet spot" },
  { label: "Half day", desc: "Deep dive" },
  { label: "Full day", desc: "Epic journey" },
];

const MOOD_OPTIONS = [
  { label: "Relax", icon: "🍃", desc: "Peace & calm" },
  { label: "Explore", icon: "🧭", desc: "Curious wander" },
  { label: "Nature", icon: "🌲", desc: "Green & outdoors" },
  { label: "Food", icon: "🍜", desc: "Flavors & treats" },
  { label: "Adventure", icon: "⚡", desc: "Adrenaline & action" },
  { label: "Culture", icon: "🏛️", desc: "Arts & heritage" },
];

export function StoryScreen({
  selectedLocation,
  setSelectedLocation,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  selectedTime,
  setSelectedTime,
  selectedMood,
  setSelectedMood,
  preferenceText,
  setPreferenceText,
  onFindSpot,
  onBackToHero,
}: StoryScreenProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessNotice, setLocationSuccessNotice] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          const address = await recommendationService.reverseGeocode(lat, lng);
          if (address) {
            setSelectedLocation(address);
          } else {
            setSelectedLocation("Current Geolocation");
          }
          setIsLocating(false);
          setIsLocationModalOpen(false);
          setLocationSuccessNotice(true);
          setTimeout(() => setLocationSuccessNotice(false), 3000);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not retrieve your GPS coordinates. Please enter manually.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleManualLocationSubmit = async () => {
    if (!manualLocation.trim()) return;

    setIsLocating(true);
    const result = await recommendationService.geocodeAddress(manualLocation);
    if (result) {
      setLatitude(result.latitude);
      setLongitude(result.longitude);
      setSelectedLocation(result.address);
      setIsLocationModalOpen(false);
      setManualLocation("");
      setLocationSuccessNotice(true);
      setTimeout(() => setLocationSuccessNotice(false), 3000);
    } else {
      alert("Could not pinpoint that location. Please try another query.");
    }
    setIsLocating(false);
  };

  return (
    <main className="min-h-[calc(100vh-4.5rem)] w-full max-w-full overflow-x-hidden flex-1 flex flex-col justify-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 relative selection:bg-emerald-500 selection:text-black">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl w-full mx-auto">
        {/* Header Title Section */}
        <div className="text-center mb-8 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[12px] font-bold tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="text-[14px]">✨</span>
            <span>The Scene Setter Console</span>
          </div>
          <h1
            className="text-[36px] sm:text-[48px] font-extrabold text-white tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Craft Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Adventure</span>
          </h1>
          <p className="text-white/60 text-[15px] sm:text-[16px] max-w-lg mx-auto mt-2">
            Tell us where you are, your window of time, and the energy you crave.
          </p>
        </div>

        {/* Console Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-white/10">
          
          {/* 1. GEOLOCATION STATUS BAR */}
          <div className="p-6 sm:p-7 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[22px] shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                📍
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    Target Location
                  </span>
                  {latitude && longitude && (
                    <span className="text-[10px] text-white/40 font-mono">
                      ({latitude.toFixed(2)}, {longitude.toFixed(2)})
                    </span>
                  )}
                </div>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight truncate max-w-md">
                  {selectedLocation}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[13px] font-bold text-white transition-all duration-200 cursor-pointer self-start sm:self-center hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Change Area</span>
            </button>
          </div>

          {/* 2. AVAILABLE TIME PILLS */}
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-[12px] font-extrabold uppercase tracking-widest text-white/90 block">
                  Available Time
                </label>
                <p className="text-[13px] text-white/50">
                  How much free time can you dedicate to this mission?
                </p>
              </div>
              <span className="text-[12px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {selectedTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setSelectedTime(t.label)}
                  className={`px-5 py-3 rounded-2xl text-[14px] font-semibold border transition-all duration-300 cursor-pointer select-none flex flex-col items-center gap-0.5 hover:scale-[1.03] active:scale-95 ${
                    selectedTime === t.label
                      ? "bg-emerald-500 text-emerald-950 font-bold border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/40"
                      : "bg-white/[0.04] text-white/80 border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <span className="font-extrabold text-[15px]">{t.label}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${selectedTime === t.label ? "text-emerald-900" : "text-white/40"}`}>
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. MOOD/VIBE SELECTOR PILLS */}
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-[12px] font-extrabold uppercase tracking-widest text-white/90 block">
                  Mood & Vibe Persona
                </label>
                <p className="text-[13px] text-white/50">
                  What sensational frequency are you tuning into right now?
                </p>
              </div>
              <span className="text-[12px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {selectedMood}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none flex items-center gap-3 hover:scale-[1.02] active:scale-95 ${
                    selectedMood.toLowerCase() === m.label.toLowerCase()
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-emerald-950 font-bold border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/40"
                      : "bg-white/[0.04] text-white/80 border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <span className="text-[24px]">{m.icon}</span>
                  <div>
                    <div className="font-extrabold text-[15px] leading-snug">{m.label}</div>
                    <div className={`text-[11px] ${selectedMood.toLowerCase() === m.label.toLowerCase() ? "text-emerald-950/80 font-medium" : "text-white/40"}`}>
                      {m.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. PREFERENCE & CTA */}
          <div className="p-6 sm:p-7 bg-white/[0.02]">
            <label className="text-[12px] font-extrabold uppercase tracking-widest text-white/90 block mb-1">
              Specific Quirks or Desires <span className="font-normal text-white/40 lowercase">(optional)</span>
            </label>
            <p className="text-[13px] text-white/50 mb-3">
              Give your local radar extra nuance (e.g. &ldquo;quiet cafe with view, pet friendly&rdquo;).
            </p>

            <div className="relative mb-5">
              <input
                type="text"
                value={preferenceText}
                onChange={(e) => setPreferenceText(e.target.value)}
                placeholder="e.g. quiet cafe with view, pet friendly, rooftop seating..."
                className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all shadow-inner"
              />
              {preferenceText && (
                <button
                  type="button"
                  onClick={() => setPreferenceText("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[12px] font-bold p-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-7">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 mr-1">Inspirations:</span>
              {["Outdoor garden", "Great coffee & books", "Sunset viewpoint", "Historic architecture"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setPreferenceText(preferenceText ? `${preferenceText}, ${tag}` : tag)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  +{tag}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onFindSpot}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 text-emerald-950 font-black text-[17px] tracking-wide hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-3 cursor-pointer shadow-xl group"
            >
              <span>Find My Spot</span>
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

        </div>
      </div>

      {/* Geolocation Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121A15] text-white w-full max-w-md rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="font-extrabold text-[18px] text-white">Target Your Location</h3>
                <p className="text-[12px] text-white/50 mt-0.5">Roamly scans real local spots within this radar perimeter</p>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition-all disabled:opacity-50 cursor-pointer font-bold text-[14px] shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                  <path d="M12 12l8.5 8.5" />
                </svg>
                <span>{isLocating ? "Detecting GPS Position..." : "Detect Current Geolocation"}</span>
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/40 text-[11px] uppercase tracking-widest font-bold">Or enter city/area</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleManualLocationSubmit();
                  }}
                  placeholder="e.g. Indiranagar, Bengaluru or Soho, London"
                  className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400 transition-all"
                />
                <button
                  onClick={handleManualLocationSubmit}
                  disabled={isLocating || !manualLocation.trim()}
                  className="w-full py-3.5 bg-white text-black font-extrabold rounded-2xl text-[14px] hover:bg-white/90 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {isLocating ? "Pinpointing Radar..." : "Confirm New Location"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}