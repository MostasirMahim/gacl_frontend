"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClubIllustration } from "./ClubIllustration";
import { LivePulse } from "./DashAtoms";

function useCurrentTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
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

  return { time, date };
}

const sectionLabels: Record<string, string> = {
  member: "Members",
  finance: "Finance",
  restaurant: "Restaurant",
  outlet: "Outlet",
  reservations: "Reservations",
  events: "Events",
  attendance: "Attendance",
  payroll: "Payroll",
  vendor: "Vendor",
  system: "System",
};

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
  const { time, date } = useCurrentTime();

  return (
    <div className="space-y-4 mb-6">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,hsl(var(--primary)) 0,hsl(var(--primary)) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,hsl(var(--primary)) 0,hsl(var(--primary)) 1px,transparent 1px,transparent 40px)",
          }}
        />
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between p-5 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isLive && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                  <LivePulse />
                  Live
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Club Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enterprise operations overview · {sections.length} section
              {sections.length !== 1 ? "s" : ""} visible
            </p>
          </div>

          {/* Club illustration */}
          <ClubIllustration className="w-44 h-16 text-primary shrink-0 hidden sm:block" />

          {/* Clock */}
          <div className="text-right shrink-0 hidden md:block">
            <div className="text-2xl font-bold text-primary tabular-nums leading-none">
              {time}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 max-w-36 text-right">
              {date}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section tabs */}
      {sections.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex gap-1 overflow-x-auto no-scrollbar pb-0.5"
        >
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => onSectionChange(s)}
              className={`relative shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 ${
                activeSection === s
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {sectionLabels[s] ?? s}
              {activeSection === s && (
                <motion.div
                  layoutId="section-indicator"
                  className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
