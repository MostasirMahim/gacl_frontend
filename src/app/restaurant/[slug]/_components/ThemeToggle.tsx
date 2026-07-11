"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

const STORAGE_KEY = "restaurant-theme";

/**
 * ThemeToggle — single icon button (sun ↔ moon).
 * Toggles `bg-dark` on <body> and persists preference in localStorage.
 * Default: dark (matches original BodyDark behaviour).
 *
 * Design: mimics the next-themes / shadcn ModeToggle pattern —
 * both icons are always in the DOM; CSS transitions swap them.
 */
const ThemeToggle = () => {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = saved !== null ? saved === "dark" : true;
    setDark(prefersDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.classList.toggle("bg-dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark, mounted]);

  // Avoid hydration flash — render invisible placeholder until mounted
  if (!mounted) return <span style={{ display: "inline-block", width: 32, height: 32 }} />;

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="theme-toggle-btn"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.9em",
        height: "1.9em",
        padding: 0,
        border: "none",
        borderRadius: 6,
        background: "transparent",
        cursor: "pointer",
        color: "inherit",
        flexShrink: 0,
        fontSize: "inherit",
        lineHeight: 1,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.25)";
      }}
    >
      {/* Sun icon — visible in light mode */}
      <SunIcon
        style={{
          position: "absolute",
          width: "1em",
          height: "1em",
          transform: dark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
          opacity: dark ? 0 : 1,
          transition: "transform 0.4s ease, opacity 0.3s ease",
        }}
      />

      {/* Moon icon — visible in dark mode */}
      <MoonIcon
        style={{
          position: "absolute",
          width: "1em",
          height: "1em",
          transform: dark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
          opacity: dark ? 1 : 0,
          transition: "transform 0.4s ease, opacity 0.3s ease",
        }}
      />

      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        Toggle theme
      </span>
    </button>
  );
};

export default ThemeToggle;

/*
 * ── PREVIOUS PILL TOGGLE (commented out for reference) ──────────────────────
 *
 * <button
 *   type="button"
 *   onClick={() => setDark((d) => !d)}
 *   style={{
 *     position: "relative",
 *     display: "inline-flex",
 *     alignItems: "center",
 *     width: 56,
 *     height: 28,
 *     borderRadius: 999,
 *     border: "none",
 *     cursor: "pointer",
 *     padding: 3,
 *     background: dark
 *       ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)"
 *       : "linear-gradient(135deg, #f8d56b 0%, #f4a823 60%, #f08c00 100%)",
 *     boxShadow: dark
 *       ? "0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 3px rgba(0,0,0,0.6)"
 *       : "0 0 0 1px rgba(0,0,0,0.12), inset 0 1px 3px rgba(0,0,0,0.15)",
 *     transition: "background 0.4s ease, box-shadow 0.4s ease",
 *   }}
 * >
 *   {/* Sliding knob *\/}
 *   <span style={{
 *     position: "absolute",
 *     top: 3,
 *     left: dark ? "calc(100% - 25px)" : 3,
 *     width: 22, height: 22,
 *     borderRadius: "50%",
 *     background: dark
 *       ? "radial-gradient(circle at 35% 35%, #c9d6ff, #e2eafc)"
 *       : "radial-gradient(circle at 35% 35%, #fffde7, #fff9c4)",
 *     boxShadow: dark
 *       ? "0 0 6px 2px rgba(180,200,255,0.5), 0 2px 4px rgba(0,0,0,0.5)"
 *       : "0 0 10px 3px rgba(255,220,50,0.7), 0 2px 4px rgba(0,0,0,0.25)",
 *     transition: "left 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.4s ease, box-shadow 0.4s ease",
 *     display: "flex", alignItems: "center", justifyContent: "center",
 *     fontSize: 11, lineHeight: 1,
 *   }}>
 *     {dark ? "🌙" : "☀️"}
 *   </span>
 *   {dark && ( <> <star dots /> </> )}
 *   {!dark && ( <sparkle /> )}
 * </button>
 *
 * ────────────────────────────────────────────────────────────────────────────
 */
