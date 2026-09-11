import { useState } from "react";
import { MOOD_OPTIONS, TIME_OPTIONS } from "../data/mockPlaces";
import { Chip } from "./ui/Chip";
import { recommendationService } from "../services/recommendationService";

interface HomeScreenProps {
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
  onSearch: () => void;
}

export function HomeScreen({
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
  onSearch,
}: HomeScreenProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);

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
            setSelectedLocation("Current Location");
          }
          setIsLocating(false);
          setIsLocationModalOpen(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter it manually.");
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
    } else {
      alert("Could not find that location. Please try again.");
    }
    setIsLocating(false);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* Hero */}
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

        {/* Input card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Location */}
          <div className="p-6 border-b border-border">
            <label className="block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
              Where are you?
            </label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAF3E8] flex items-center justify-center shrink-0">
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
                  <p className="text-[14px] font-medium text-foreground line-clamp-1 max-w-[200px] md:max-w-[300px]">
                    {selectedLocation}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Current location
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-[12px] font-medium text-accent hover:text-primary transition-colors cursor-pointer shrink-0"
              >
                Change
              </button>
            </div>
          </div>

          {/* Time */}
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

          {/* Mood */}
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

          {/* Preference + CTA */}
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
            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={onSearch}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold hover:bg-accent transition-colors flex items-center gap-2 cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-muted-foreground mt-6">
          Example: 2 hours &middot; Relax &middot; Nearby
        </p>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-secondary/50">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Change Location</h3>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-5 space-y-6">
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-accent/30 bg-accent/5 text-accent hover:bg-accent/10 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12l8.5 8.5"/></svg>
                <span className="font-medium">{isLocating ? "Locating..." : "Use my current location"}</span>
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-wider font-semibold">Or enter manually</span>
                <div className="flex-grow border-t border-border"></div>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  placeholder="City, neighborhood, or address"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                <button
                  onClick={handleManualLocationSubmit}
                  disabled={isLocating || !manualLocation.trim()}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isLocating ? "Searching..." : "Set Location"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
