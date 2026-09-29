"use client";

// High-fidelity architectural club building matching the design mockup
// Uses currentColor to dynamically adapt to any theme primary color
export function ClubIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ground baseline */}
      <line
        x1="6"
        y1="86"
        x2="194"
        y2="86"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />

      {/* Left Wing Base & Roof */}
      <polygon
        points="16,86 16,56 68,52 68,86"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      {/* Left Wing Windows (Lit) */}
      <rect
        x="24"
        y="60"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1"
      />
      <rect
        x="39"
        y="60"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1"
      />
      <rect
        x="54"
        y="60"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1"
      />

      {/* Right Wing Base & Roof */}
      <polygon
        points="132,86 132,52 184,56 184,86"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      {/* Right Wing Windows (Lit) */}
      <rect
        x="138"
        y="60"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1"
      />
      <rect
        x="153"
        y="60"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1"
      />
      <rect
        x="168"
        y="60"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1"
      />

      {/* Center Main Pavilion Body */}
      <rect
        x="66"
        y="36"
        width="68"
        height="50"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />

      {/* Main Pediment / Triangular Gable */}
      <polygon
        points="62,36 100,10 138,36"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />

      {/* Center Roof Flagpole & Pennant */}
      <line
        x1="100"
        y1="10"
        x2="100"
        y2="2"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.2"
      />
      <polygon
        points="100,2 110,5 100,8"
        fill="currentColor"
        fillOpacity="0.85"
      />

      {/* Hexagonal Illuminated Club Crest on Pediment */}
      <polygon
        points="100,18 107,22 107,30 100,34 93,30 93,22"
        fill="currentColor"
        fillOpacity="0.8"
        stroke="currentColor"
        strokeOpacity="0.95"
        strokeWidth="1"
      />

      {/* Upper Floor Windows (Lit) */}
      <rect
        x="75"
        y="42"
        width="11"
        height="13"
        rx="2"
        fill="currentColor"
        fillOpacity="0.65"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="0.8"
      />
      <rect
        x="94"
        y="42"
        width="11"
        height="13"
        rx="2"
        fill="currentColor"
        fillOpacity="0.65"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="0.8"
      />
      <rect
        x="114"
        y="42"
        width="11"
        height="13"
        rx="2"
        fill="currentColor"
        fillOpacity="0.65"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="0.8"
      />

      {/* Grand Entrance Portal (Lit) */}
      <rect
        x="90"
        y="62"
        width="20"
        height="24"
        rx="4"
        fill="currentColor"
        fillOpacity="0.7"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1.2"
      />
      <line
        x1="100"
        y1="62"
        x2="100"
        y2="86"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {/* Architectural Flank Columns */}
      <line
        x1="70"
        y1="36"
        x2="70"
        y2="86"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <line
        x1="130"
        y1="36"
        x2="130"
        y2="86"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
    </svg>
  );
}
