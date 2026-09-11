import { Place } from "../types";

interface MapPlaceholderProps {
  places?: Place[];
  activePlaceId?: string;
  onSelectPlace?: (place: Place) => void;
}

export function MapPlaceholder({
  places = [],
  activePlaceId,
  onSelectPlace,
}: MapPlaceholderProps) {
  const defaultPins = [
    { x: 38, y: 44, label: "Cubbon", id: "cubbon" },
    { x: 55, y: 65, label: "Lalbagh", id: "lalbagh" },
    { x: 62, y: 35, label: "Palace", id: "palace" },
    { x: 48, y: 55, label: "Church St", id: "church-street" },
  ];

  const pins = places.length > 0
    ? places.slice(0, 5).map((p, i) => ({
        x: p.coordinates?.x ?? (defaultPins[i % defaultPins.length]?.x ?? 50),
        y: p.coordinates?.y ?? (defaultPins[i % defaultPins.length]?.y ?? 50),
        label: p.coordinates?.label ?? p.name,
        id: p.id,
        place: p,
      }))
    : defaultPins.map((d, i) => ({ ...d, place: undefined }));

  return (
    <div className="relative w-full h-full min-h-[280px] bg-[#EAE8E2] rounded-xl overflow-hidden border border-border select-none">
      {/* Grid lines pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="map-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="#C4C0B8"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>

      {/* Road-like schematic paths */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0%"
          y1="50%"
          x2="100%"
          y2="48%"
          stroke="#B0ACA5"
          strokeWidth="2"
        />
        <line
          x1="45%"
          y1="0%"
          x2="52%"
          y2="100%"
          stroke="#B0ACA5"
          strokeWidth="2"
        />
        <line
          x1="20%"
          y1="30%"
          x2="80%"
          y2="70%"
          stroke="#B0ACA5"
          strokeWidth="1.5"
        />
        <path
          d="M 10% 80% Q 40% 40% 90% 30%"
          stroke="#B0ACA5"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* Numbered Pins */}
      {pins.map((pin, i) => {
        const isActive = activePlaceId === pin.id;
        return (
          <div
            key={pin.id || i}
            onClick={() => pin.place && onSelectPlace && onSelectPlace(pin.place)}
            className={`absolute flex flex-col items-center cursor-pointer transition-transform duration-200 ${
              isActive ? "scale-125 z-10" : "hover:scale-110"
            }`}
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: "translate(-50%, -100%)",
            }}
            title={pin.label}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                isActive
                  ? "bg-accent ring-2 ring-primary ring-offset-1 text-white"
                  : "bg-primary text-white"
              }`}
            >
              <span className="text-[9px] font-bold">{i + 1}</span>
            </div>
            <div className={`w-0.5 h-1.5 ${isActive ? "bg-accent" : "bg-primary"}`} />
          </div>
        );
      })}

      {/* Map Location Overlay Badge */}
      <div className="absolute bottom-3 left-3 bg-card/85 backdrop-blur-xs border border-border rounded-lg px-2.5 py-1.5 shadow-xs">
        <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
          Near Bengaluru, KA
        </p>
      </div>
    </div>
  );
}
