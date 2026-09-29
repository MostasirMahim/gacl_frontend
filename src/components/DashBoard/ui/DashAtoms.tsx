"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Animated counting number ──────────────────────────────────────────────
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 60, damping: 12 });
  const [display, setDisplay] = useState(
    decimals > 0 ? (0).toFixed(decimals) : "0"
  );

  useEffect(() => {
    const unsub = spring.on("change", (v: number) => {
      setDisplay(
        decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString()
      );
    });
    return () => unsub();
  }, [spring, decimals]);

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ─── Hexagon icon container ─────────────────────────────────────────────────
export function HexIcon({
  children,
  size = 44,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center bg-primary/10 text-primary shrink-0"
      style={{
        width: size,
        height: size,
        clipPath:
          "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Trend badge ────────────────────────────────────────────────────────────
export function TrendBadge({
  value,
  label = "vs last month",
}: {
  value?: number;
  label?: string;
}) {
  if (value === undefined || value === null) return null;
  const isUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-sm ${
        isUp
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {isUp ? "↑" : "↓"} {Math.abs(value)}% {label}
    </span>
  );
}

// ─── Status dot ─────────────────────────────────────────────────────────────
export function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-emerald-500",
    active: "bg-emerald-500",
    confirmed: "bg-emerald-500",
    pending: "bg-amber-500",
    pending_payment: "bg-amber-500",
    maintenance: "bg-amber-500",
    closed: "bg-muted-foreground",
    cancelled: "bg-destructive",
    billed: "bg-primary",
    preparing: "bg-primary",
    ready: "bg-primary/60",
    served: "bg-muted-foreground",
  };
  const color = map[status] ?? "bg-muted-foreground";
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${color}`}
    />
  );
}

// ─── Section wrapper with entrance animation ─────────────────────────────
export function SectionMotion({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Card shell ──────────────────────────────────────────────────────────
export function DashCard({
  children,
  className = "",
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative bg-card border border-border rounded-xl overflow-hidden ${
        accent ? "border-l-2 border-l-primary" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────
export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Skeleton pulse ──────────────────────────────────────────────────────
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-muted/60 ${className}`}
    />
  );
}

// ─── Live pulse indicator ────────────────────────────────────────────────
export function LivePulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────
export function EmptyState({ message = "No data available" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <svg
        className="w-10 h-10 mb-2 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17v-2a4 4 0 014-4h0a4 4 0 014 4v2M3 21h18M12 3a4 4 0 100 8 4 4 0 000-8z"
        />
      </svg>
      <p className="text-xs">{message}</p>
    </div>
  );
}
