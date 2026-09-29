"use client";

// Minimal abstract club building silhouette as inline SVG
// Uses currentColor so it respects primary color
export function ClubIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ground line */}
      <line x1="10" y1="72" x2="190" y2="72" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />

      {/* Main building */}
      <rect x="60" y="30" width="80" height="42" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.8" />

      {/* Roof triangle */}
      <polygon points="60,30 100,8 140,30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />

      {/* Flag */}
      <line x1="100" y1="8" x2="100" y2="0" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8" />
      <polygon points="100,0 108,3 100,6" fill="currentColor" fillOpacity="0.4" />

      {/* Main entrance door */}
      <rect x="88" y="52" width="16" height="20" rx="8" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8" />

      {/* Windows row */}
      {[70, 84, 116, 130].map((x) => (
        <rect key={x} x={x} y="38" width="10" height="8" rx="1" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.6" />
      ))}

      {/* Left wing */}
      <rect x="20" y="45" width="38" height="27" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.6" />
      <rect x="142" y="45" width="38" height="27" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.6" />

      {/* Columns (decorative) */}
      {[65, 74, 118, 127].map((x) => (
        <line key={x} x1={x} y1="30" x2={x} y2="72" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.6" />
      ))}

      {/* Trees */}
      {[30, 160].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="62" rx="10" ry="8" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.5" />
          <line x1={x} y1="70" x2={x} y2="72" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}
