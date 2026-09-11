"use client";

import { useState } from "react";
import { DetailScreen } from "./components/DetailScreen";
import { Header } from "./components/Header";
import { HomeScreen } from "./components/HomeScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { SavedScreen } from "./components/SavedScreen";
import { PLACES } from "./data/mockPlaces";
import { Place, Screen } from "./types";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLocation, setSelectedLocation] = useState("Bengaluru, Karnataka");
  const [latitude, setLatitude] = useState<number | undefined>(12.9716);
  const [longitude, setLongitude] = useState<number | undefined>(77.5946);
  const [selectedTime, setSelectedTime] = useState("2 hours");
  const [selectedMood, setSelectedMood] = useState("Relax");
  const [preferenceText, setPreferenceText] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  
  // Results state
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function openDetail(place: Place) {
    setActivePlace(place);
    setScreen("detail");
  }

  function navigate(s: Screen) {
    setScreen(s);
    if (s !== "detail") setActivePlace(null);
  }

  const savedPlaces = results.filter((p) => savedIds.has(p.id)); // Use results instead of PLACES for now, but really this should query a saved list

  const handleSearch = async () => {
    setIsLoading(true);
    setScreen("results");
    
    // Import recommendationService dynamically or at the top
    const { recommendationService } = await import('./services/recommendationService');
    
    const fetchedPlaces = await recommendationService.getRecommendations({
      location: selectedLocation,
      latitude,
      longitude,
      time: selectedTime,
      mood: selectedMood,
      preferenceText
    });
    
    setResults(fetchedPlaces);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Header activeScreen={screen} onNavigate={navigate} />

      {screen === "home" && (
        <HomeScreen
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          preferenceText={preferenceText}
          setPreferenceText={setPreferenceText}
          onSearch={handleSearch}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          selectedLocation={selectedLocation}
          selectedTime={selectedTime}
          selectedMood={selectedMood}
          places={results}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onPlaceClick={openDetail}
          onEditPreferences={() => setScreen("home")}
          // isLoading={isLoading}
        />
      )}

      {screen === "detail" && activePlace && (
        <DetailScreen
          place={activePlace}
          saved={savedIds.has(activePlace.id)}
          onToggleSave={() => toggleSave(activePlace.id)}
          onBack={() => setScreen("results")}
        />
      )}

      {screen === "saved" && (
        <SavedScreen
          savedPlaces={savedPlaces}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onPlaceClick={openDetail}
        />
      )}
    </div>
  );
}
