export function RoamlyLogo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="14" cy="14" r="13" stroke="#2A5C23" strokeWidth="1.5" />
        <circle cx="14" cy="13" r="4" fill="#2A5C23" />
        <path
          d="M14 17 C14 17 8 22 14 26"
          stroke="#2A5C23"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
      <span
        className="text-[17px] font-semibold tracking-[-0.3px] text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Roamly
      </span>
    </div>
  );
}
