"use client";

import { useEffect } from "react";

/**
 * BodyDark — applies the stored theme preference on mount.
 * Include this in layouts that don't render HeaderTopV1 (which has ThemeToggle).
 * If no preference is stored, defaults to dark (original behaviour).
 */
const BodyDark = () => {
  useEffect(() => {
    const saved = localStorage.getItem("restaurant-theme");
    const prefersDark = saved !== null ? saved === "dark" : true;

    if (prefersDark) {
      document.body.classList.add("bg-dark");
    } else {
      document.body.classList.remove("bg-dark");
    }

    return () => {
      document.body.classList.remove("bg-dark");
    };
  }, []);

  return null;
};

export default BodyDark;
