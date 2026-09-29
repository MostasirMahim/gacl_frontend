"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Users,
  Coins,
  UtensilsCrossed,
  Store,
  CalendarCheck,
  Calendar,
  UserCheck,
  Receipt,
  Truck,
  Settings,
  LucideIcon,
} from "lucide-react";

function useGreetingAndTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return { greeting, time, date };
}

const sectionConfig: Record<string, { label: string; icon: LucideIcon }> = {
  overview: { label: "Overview", icon: LayoutGrid },
  member: { label: "Members", icon: Users },
  finance: { label: "Finance", icon: Coins },
  restaurant: { label: "Restaurant", icon: UtensilsCrossed },
  outlet: { label: "Outlet", icon: Store },
  reservations: { label: "Reservations", icon: CalendarCheck },
  events: { label: "Events", icon: Calendar },
  attendance: { label: "Attendance", icon: UserCheck },
  payroll: { label: "Payroll", icon: Receipt },
  vendor: { label: "Vendor", icon: Truck },
  system: { label: "System", icon: Settings },
};

function DashboardHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Multi-shade organic wave curves with zero cropped lines */}
      <svg
        className="absolute inset-0 w-full h-full min-h-[160px] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 280"
        fill="none"
      >
        <defs>
          {/* Wave Gradient 1: Sky to Lavender - fading in smoothly from left 0% to prevent cuts */}
          <linearGradient id="heroWaveShade1" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="15%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="48%" stopColor="hsl(var(--primary))" stopOpacity="0.09" />
            <stop offset="85%" stopColor="#818cf8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
          </linearGradient>

          {/* Wave Gradient 2: Soft Violet to Cyan */}
          <linearGradient id="heroWaveShade2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
            <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.03" />
          </linearGradient>

          {/* Soft ambient radial glow under the illustration */}
          <radialGradient id="heroIllustrationGlow" cx="78%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow behind right illustration */}
        <ellipse cx="1140" cy="140" rx="300" ry="135" fill="url(#heroIllustrationGlow)" />

        {/* Back smooth continuous wave: starts far-left to avoid cutoffs, gentle sweep */}
        <path
          d="M-300 280 L-300 180 C 0 150, 200 250, 500 160 C 800 70, 1000 200, 1300 130 C 1500 80, 1600 140, 1800 150 L1800 280 Z"
          fill="url(#heroWaveShade1)"
        />

        {/* Fore smooth wave: fluid cresting wave matching brand theme */}
        <path
          d="M-300 280 L-300 220 C 50 200, 300 130, 600 210 C 900 290, 1150 150, 1400 190 C 1550 210, 1700 170, 1800 190 L1800 280 Z"
          fill="url(#heroWaveShade2)"
        />
      </svg>

      {/* Ambient background soft blur spots */}
      <div className="absolute -top-12 left-6 w-80 h-48 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1 left-1/3 w-80 h-36 bg-sky-500/6 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

interface DashHeaderProps {
  sections: string[];
  activeSection: string;
  onSectionChange: (s: string) => void;
  isLive?: boolean;
}

export function DashHeader({
  sections,
  activeSection,
  onSectionChange,
  isLive = false,
}: DashHeaderProps) {
  const { greeting, time, date } = useGreetingAndTime();
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  // When cursor is over the tabs bar, scroll the tabs horizontally instead of scrolling the page
  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        if (Math.abs(e.deltaY) > 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="mb-4">
      {/* ─── UPPER TOP HERO: OPEN CANVAS WITH SEAMLESS SVG SHAPES ─── */}
      <div className="relative pt-1 pb-0 px-1 overflow-hidden">
        <DashboardHeroBg />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pl-4">
          {/* Left Text with refined title font & lighter weight */}
          <div className="max-w-xl z-10 py-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-[26px] font-medium text-foreground tracking-normal leading-snug">
                {greeting}, welcome back...
              </h1>
              {/* {isLive && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              )} */}
            </div>

            <p className="text-xs sm:text-[13px] text-muted-foreground font-normal mb-2">
              Everything you need to keep operations moving, all in one place.
            </p>

            {/* Modern editorial inline date & time format */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-xs" />
              <span className="font-bold text-foreground tabular-nums">{time}</span>
              <span className="text-muted-foreground/90">·</span>
              <span className="text-foreground">{date}</span>
            </div>
          </div>

          {/* Right Visual matching 1st image from /assets/dashboard_right.png */}
          <div className="hidden md:flex items-end justify-end shrink-0 self-end -mr-2 -mb-1 pointer-events-none select-none z-10">
            <img
              src="/assets/dashboard_right.png"
              alt="Club Operations"
              className="h-32 lg:h-40 w-auto object-contain object-bottom drop-shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ─── TABS WITH BACKGROUND BAR CONTAINER & HORIZONTAL WHEEL SCROLL ─── */}
      {sections.length > 1 && (
        <div className="bg-card/95 border border-border/80 rounded-md p-0.5 shadow-xs">
          <div
            ref={tabsScrollRef}
            className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {sections.map((s) => {
              const isActive = activeSection === s;
              const cfg = sectionConfig[s] ?? { label: s, icon: LayoutGrid };
              const Icon = cfg.icon;
              return (
                <button
                  key={s}
                  onClick={() => onSectionChange(s)}
                  className={`group relative shrink-0 px-3.5 py-1.5 text-xs rounded-md flex items-center gap-2 transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent font-normal"
                  }`}
                >
                  <Icon
                    size={14}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground transition-colors"
                    }
                  />
                  <span>{cfg.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-section-indicator"
                      className="absolute inset-0 rounded-md bg-primary/10 -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
