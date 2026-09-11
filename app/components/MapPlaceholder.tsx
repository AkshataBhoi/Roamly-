export function MapPlaceholder() {
  const pins = [
    { x: 38, y: 44, label: "Cubbon" },
    { x: 55, y: 65, label: "Lalbagh" },
    { x: 62, y: 35, label: "Palace" },
    { x: 48, y: 55, label: "Church St" },
  ];
  return (
    <div className="relative w-full h-full min-h-[280px] bg-[#EAE8E2] rounded-xl overflow-hidden border border-border">
      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
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
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Road-like lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
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
      {/* Pins */}
      {pins.map((pin, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <span className="text-white text-[9px] font-bold">{i + 1}</span>
          </div>
          <div className="w-0.5 h-1.5 bg-primary" />
        </div>
      ))}
      {/* Label */}
      <div className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-2.5 py-1.5">
        <p className="text-[11px] font-medium text-muted-foreground">
          Near Bengaluru, KA
        </p>
      </div>
    </div>
  );
}
