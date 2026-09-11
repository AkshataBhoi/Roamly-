import { useState } from "react";
import { MOOD_OPTIONS, TIME_OPTIONS } from "../data/mockPlaces";
import { Chip } from "./ui/Chip";

interface HomeScreenProps {
  selectedLocation: string;
  setSelectedLocation: (l: string) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  selectedMood: string;
  setSelectedMood: (m: string) => void;
  preferenceText: string;
  setPreferenceText: (t: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export function HomeScreen({
  selectedLocation,
  setSelectedLocation,
  selectedTime,
  setSelectedTime,
  selectedMood,
  setSelectedMood,
  preferenceText,
  setPreferenceText,
  onSearch,
  isLoading = false,
}: HomeScreenProps) {
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState(selectedLocation);

  function handleLocationSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locationInput.trim()) {
      setSelectedLocation(locationInput.trim());
    }
    setIsChangingLocation(false);
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-10 md:py-16">
        {/* Hero Section */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-widest text-accent uppercase mb-4">
            Local Discovery
          </p>
          <h1
            className="text-[38px] md:text-[48px] font-semibold text-foreground leading-[1.1] tracking-[-1px] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What can you do
            <br />
            right now?
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-md">
            Tell us how much time you have and what you&apos;re in the mood for.
            We&apos;ll find places worth your time.
          </p>
        </div>

        {/* Main Input Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          {/* Section 1: Location */}
          <div className="p-6 border-b border-border">
            <label className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
              Where are you?
            </label>

            {!isChangingLocation ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAF3E8] border border-[#C8E0C4] flex items-center justify-center shrink-0">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="#2A5C23"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="7" cy="6" r="2.5" />
                      <path d="M7 1C4.5 1 2.5 3 2.5 6c0 3.5 4.5 7 4.5 7s4.5-3.5 4.5-7c0-3-2-5-4.5-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-foreground">
                      {selectedLocation}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      Current location
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangingLocation(true)}
                  className="text-[12px] font-medium text-accent hover:text-primary transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleLocationSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter city or area..."
                  className="flex-1 bg-secondary border border-border rounded-lg px-3.5 py-2 text-[13px] text-foreground focus:outline-none focus:border-accent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:bg-accent"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingLocation(false)}
                  className="px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Section 2: Available Time */}
          <div className="p-6 border-b border-border">
            <label className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
              How much time do you have?
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={selectedTime === t}
                  onClick={() => setSelectedTime(t)}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Mood */}
          <div className="p-6 border-b border-border">
            <label className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
              What are you in the mood for?
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  selected={selectedMood === m}
                  onClick={() => setSelectedMood(m)}
                />
              ))}
            </div>
          </div>

          {/* Section 4: Specific preference + Primary CTA */}
          <div className="p-6">
            <label className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
              Anything specific?
            </label>
            <input
              type="text"
              value={preferenceText}
              onChange={(e) => setPreferenceText(e.target.value)}
              placeholder="e.g. somewhere quiet, good for photos…"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
            <div className="mt-5 flex items-center justify-end">
              <button
                type="button"
                onClick={onSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold hover:bg-accent active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {isLoading ? (
                  <span>Finding places…</span>
                ) : (
                  <>
                    <span>Find places</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 7h10M7 2l5 5-5 5" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-muted-foreground mt-6">
          Example: 2 hours &middot; Relax &middot; Nearby
        </p>
      </div>
    </main>
  );
}
