"use client";

import { useEffect, useState } from "react";
import { DetailScreen } from "./components/DetailScreen";
import { Header } from "./components/Header";
import { HomeScreen } from "./components/HomeScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { SavedScreen } from "./components/SavedScreen";
import { PLACES } from "./data/mockPlaces";
import { recommendationService } from "./services/recommendationService";
import { Place, Screen } from "./types";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLocation, setSelectedLocation] = useState("Bengaluru, Karnataka");
  const [selectedTime, setSelectedTime] = useState("2 hours");
  const [selectedMood, setSelectedMood] = useState("Relax");
  const [preferenceText, setPreferenceText] = useState("");
  const [places, setPlaces] = useState<Place[]>(PLACES);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["cubbon"]));
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize initial recommendations based on defaults
  useEffect(() => {
    recommendationService
      .getRecommendations({
        location: selectedLocation,
        time: selectedTime,
        mood: selectedMood,
        preferenceText: preferenceText,
      })
      .then((recs) => setPlaces(recs))
      .catch(() => setPlaces(PLACES));
  }, []);

  function handleToggleSave(id: string) {
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

  async function handleSearch() {
    setIsLoading(true);
    try {
      const recs = await recommendationService.getRecommendations({
        location: selectedLocation,
        time: selectedTime,
        mood: selectedMood,
        preferenceText: preferenceText,
      });
      setPlaces(recs);
      setScreen("results");
    } catch {
      setPlaces(PLACES);
      setScreen("results");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenDetail(place: Place) {
    setActivePlace(place);
    setScreen("detail");
  }

  function handleNavigate(target: Screen) {
    if (target === "results") {
      setScreen("results");
      setActivePlace(null);
    } else if (target === "saved") {
      setScreen("saved");
      setActivePlace(null);
    } else if (target === "home") {
      setScreen("home");
      setActivePlace(null);
    } else {
      setScreen(target);
    }
  }

  // Get list of saved places from master list
  const savedPlaces = places.filter((p) => savedIds.has(p.id));
  // If some saved place is not in the filtered query list, look up in PLACES
  const allSavedPlaces = Array.from(savedIds)
    .map((id) => places.find((p) => p.id === id) || PLACES.find((p) => p.id === id))
    .filter((p): p is Place => Boolean(p));

  return (
    <div className="flex flex-col h-full min-h-screen bg-background text-foreground selection:bg-[#D4E8CF] selection:text-primary">
      {/* Universal Header */}
      <Header
        activeScreen={screen}
        onNavigate={handleNavigate}
        savedCount={savedIds.size}
      />

      {/* Screen Routing */}
      {screen === "home" && (
        <HomeScreen
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          preferenceText={preferenceText}
          setPreferenceText={setPreferenceText}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          selectedLocation={selectedLocation}
          selectedTime={selectedTime}
          selectedMood={selectedMood}
          places={places}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onPlaceClick={handleOpenDetail}
          onEditPreferences={() => setScreen("home")}
          activeMapPlaceId={activePlace?.id}
          onMapPlaceSelect={handleOpenDetail}
        />
      )}

      {screen === "detail" && activePlace && (
        <DetailScreen
          place={activePlace}
          saved={savedIds.has(activePlace.id)}
          onToggleSave={() => handleToggleSave(activePlace.id)}
          onBack={() => setScreen("results")}
        />
      )}

      {screen === "saved" && (
        <SavedScreen
          savedPlaces={allSavedPlaces}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onPlaceClick={handleOpenDetail}
          onExploreClick={() => setScreen("results")}
        />
      )}
    </div>
  );
}
