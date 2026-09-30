"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { BRAND_CONFIG } from "@/config/brand"

// ─────────────────────────────────────────────────────────────────────────────
// LOADING — Inline spinner (used inside buttons, table action cells, badges)
// ─────────────────────────────────────────────────────────────────────────────
export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "default" | "lg" | "xl"
  variant?: "primary" | "foreground" | "white" | "muted"
  showText?: boolean
  text?: string
  center?: boolean
  fullHeight?: boolean
}

export function Loading({
  size = "default",
  variant = "primary",
  showText = false,
  text = "Loading",
  center = false,
  fullHeight = false,
  className,
  ...props
}: LoadingProps) {
  const sizeClasses = {
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-11 w-11",
  }

  const variantStroke = {
    primary: "hsl(var(--primary))",
    foreground: "hsl(var(--foreground))",
    white: "#ffffff",
    muted: "hsl(var(--muted-foreground))",
  }

  const strokeColor = variantStroke[variant] || variantStroke.primary

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center gap-2",
        center && "absolute inset-0 m-auto",
        fullHeight && "h-full",
        className
      )}
      {...props}
    >
      <div className={cn("relative shrink-0", sizeClasses[size])}>
        {/* Subtle background track */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32" fill="none">
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke={strokeColor}
            strokeWidth="2.5"
            opacity={0.15}
          />
        </svg>

        {/* Continuous fluid spinning arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ animation: "erpFluidSpin 0.9s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite" }}
          viewBox="0 0 32 32"
          fill="none"
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="26 56"
          />
        </svg>

        {/* Inner micro-orbital for larger sizes */}
        {(size === "lg" || size === "xl") && (
          <svg
            className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)]"
            style={{ animation: "erpFluidSpinRev 0.7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite" }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="14 42"
              opacity={0.65}
            />
          </svg>
        )}
      </div>

      {showText && (
        <span
          className={cn(
            "font-secondary font-medium text-muted-foreground tracking-wide",
            size === "xs" && "text-[9px]",
            size === "sm" && "text-[10px]",
            size === "default" && "text-xs",
            size === "lg" && "text-sm",
            size === "xl" && "text-base"
          )}
        >
          {text}
        </span>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING PAGE — Full-screen enterprise splash loader with fluid kinetic motion
// ─────────────────────────────────────────────────────────────────────────────
export function LoadingPage({
  variant = "primary",
  text,
  className,
  ...props
}: Omit<LoadingProps, "center" | "fullHeight" | "size"> & {
  backdrop?: boolean
}) {
  const brandName = BRAND_CONFIG.appName || "GACL ENTERPRISE"

  return (
    <div
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center bg-background/95 backdrop-blur-2xl select-none overflow-hidden",
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            opacity: 0.1,
            animation: "erpAuraPulse 3.5s ease-in-out infinite",
          }}
        />
        {/* Architectural coordinate grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
            opacity: 0.02,
          }}
        />
      </div>

      {/* Center Console Card */}
      <div className="relative flex flex-col items-center max-w-sm w-full mx-4 px-8 py-9 rounded-2xl bg-card/85 border border-border/80 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.22)] dark:shadow-[0_28px_72px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        {/* Top luminous accent edge */}
        <div className="absolute top-0 inset-x-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-2xs mb-7">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold text-primary font-secondary tracking-[0.16em] uppercase">
            Secure Workspace
          </span>
        </div>

        {/* Dynamic Kinetic Tri-Orbital Engine (NO static icon box) */}
        <div className="relative w-20 h-20 mb-7 flex items-center justify-center">
          {/* Ring 1: Outer smooth spinning laser arc */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ animation: "erpFluidSpin 1.4s cubic-bezier(0.4, 0.08, 0.4, 0.95) infinite" }}
            viewBox="0 0 80 80"
            fill="none"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="hsl(var(--primary)/0.12)"
              strokeWidth="2.5"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="65 160"
            />
          </svg>

          {/* Ring 2: Counter-rotating middle orbital with distinct velocity */}
          <svg
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)]"
            style={{ animation: "erpFluidSpinRev 1.0s cubic-bezier(0.4, 0.08, 0.4, 0.95) infinite" }}
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r="27"
              stroke="hsl(var(--primary)/0.15)"
              strokeWidth="2"
            />
            <circle
              cx="32"
              cy="32"
              r="27"
              stroke="hsl(var(--primary)/0.65)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="40 130"
            />
          </svg>

          {/* Ring 3: Inner rapid micro-gyro */}
          <svg
            className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]"
            style={{ animation: "erpFluidSpin 0.7s linear infinite" }}
            viewBox="0 0 48 48"
            fill="none"
          >
            <circle
              cx="24"
              cy="24"
              r="19"
              stroke="hsl(var(--primary)/0.35)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="22 97"
            />
          </svg>

          {/* Center Pulsing Radiant Core (living breathing energy node) */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Soft ripple pulse */}
            <div
              className="absolute w-7 h-7 rounded-full bg-primary/20"
              style={{ animation: "erpRipple 1.4s ease-out infinite" }}
            />
            {/* Core glowing dot */}
            <div
              className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary))]"
              style={{ animation: "erpCoreBreathing 1.4s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Brand Block */}
        <div className="flex flex-col items-center gap-1.5 text-center mb-6">
          <h2 className="text-lg font-bold tracking-tight text-foreground font-primary">
            {brandName}
          </h2>
          <p className="text-xs font-medium text-muted-foreground/80 font-secondary tracking-wide">
            {text || "Initialising enterprise workspace & records…"}
          </p>
        </div>

        {/* Laser Progress Sweeper */}
        <div className="relative w-52 h-1 rounded-full overflow-hidden bg-muted/80 border border-border/50 mb-5">
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-primary/30 via-primary to-primary shadow-[0_0_8px_hsl(var(--primary))]"
            style={{ animation: "erpLaserSweep 1.8s ease-in-out infinite" }}
          />
        </div>

        {/* Telemetry Footer Row */}
        <div className="flex items-center justify-center gap-2 text-[9px] font-semibold text-muted-foreground/50 font-secondary tracking-widest uppercase">
          <span>ENCRYPTED TLS 1.3</span>
          <span>•</span>
          <span>ENTERPRISE RUNTIME READY</span>
        </div>
      </div>

      <style>{`
        @keyframes erpFluidSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes erpFluidSpinRev {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes erpAuraPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.08; }
          50% { transform: translate(-50%, -50%) scale(1.14); opacity: 0.14; }
        }
        @keyframes erpCoreBreathing {
          0%, 100% { transform: scale(0.9); opacity: 0.85; }
          50% { transform: scale(1.25); opacity: 1; filter: drop-shadow(0 0 6px hsl(var(--primary))); }
        }
        @keyframes erpRipple {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes erpLaserSweep {
          0% { left: -45%; width: 40%; }
          50% { left: 35%; width: 55%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING DOTS — Primary Data-Fetch Indicator (Used across 130+ pages, modals & tables)
// Fluid Kinetic Dual-Orbital Gyroscope (NO static network bars, NO static icons)
// ─────────────────────────────────────────────────────────────────────────────
export function LoadingDots({
  className,
  text = "Loading data",
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  text?: string
  size?: "sm" | "default" | "lg"
}) {
  const gyroSizes = {
    sm: "w-8 h-8",
    default: "w-11 h-11",
    lg: "w-14 h-14",
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 min-h-[200px] w-full bg-transparent select-none gap-4",
        className
      )}
      {...props}
    >
      {/* Kinetic Dual-Orbital Gyroscope Spinner */}
      <div className={cn("relative shrink-0 flex items-center justify-center", gyroSizes[size])}>
        {/* Outer Ring Track */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 44 44" fill="none">
          <circle
            cx="22"
            cy="22"
            r="19"
            stroke="hsl(var(--primary)/0.12)"
            strokeWidth="2.5"
          />
        </svg>

        {/* Outer Sweeping Primary Arc */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ animation: "erpFluidSpin 1.1s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite" }}
          viewBox="0 0 44 44"
          fill="none"
        >
          <circle
            cx="22"
            cy="22"
            r="19"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="36 84"
          />
        </svg>

        {/* Inner Counter-Spinning Orbital Arc */}
        <svg
          className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)]"
          style={{ animation: "erpFluidSpinRev 0.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite" }}
          viewBox="0 0 32 32"
          fill="none"
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke="hsl(var(--primary)/0.6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="22 60"
          />
        </svg>

        {/* Center Pulsing Energy Core */}
        <div className="relative z-10 flex items-center justify-center">
          <div
            className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
            style={{ animation: "erpCoreBreathing 1.1s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Refined Context Label with Animated Sequential Ellipses */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-muted-foreground font-secondary tracking-[0.16em] uppercase">
          {text}
        </span>
        <span className="flex items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-primary/70"
              style={{
                animation: `erpDotPulse 1.2s ease-in-out ${i * 0.22}s infinite`,
              }}
            />
          ))}
        </span>
      </div>

      <style>{`
        @keyframes erpFluidSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes erpFluidSpinRev {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes erpCoreBreathing {
          0%, 100% { transform: scale(0.85); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 4px hsl(var(--primary))); }
        }
        @keyframes erpDotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING CARD — Card-level placeholder (used inside panels and widgets)
// ─────────────────────────────────────────────────────────────────────────────
export function LoadingCard({
  className,
  text = "Loading records",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { text?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 shadow-xs flex flex-col items-center justify-center gap-4 min-h-[200px]",
        className
      )}
      {...props}
    >
      {/* Top subtle glow line */}
      <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Kinetic Dual-Orbital Gyro */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ animation: "erpFluidSpin 1.1s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite" }}
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle
            cx="20"
            cy="20"
            r="17"
            stroke="hsl(var(--primary)/0.12)"
            strokeWidth="2.5"
          />
          <circle
            cx="20"
            cy="20"
            r="17"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="30 76"
          />
        </svg>

        <svg
          className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)]"
          style={{ animation: "erpFluidSpinRev 0.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite" }}
          viewBox="0 0 28 28"
          fill="none"
        >
          <circle
            cx="14"
            cy="14"
            r="11"
            stroke="hsl(var(--primary)/0.6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="18 52"
          />
        </svg>

        <div className="relative z-10 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
      </div>

      <div className="flex flex-col items-center gap-2 w-full max-w-[180px]">
        <p className="text-xs font-semibold text-foreground/80 font-secondary tracking-wide">
          {text}
        </p>
        <div className="w-full h-1.5 rounded-full bg-muted/70 overflow-hidden relative border border-border/40">
          <div
            className="absolute inset-y-0 rounded-full bg-primary/50"
            style={{ animation: "erpLaserSweep 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SKELETON — Shimmer bar with primary-tinted light sweep
// ─────────────────────────────────────────────────────────────────────────────
export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-muted/60", className)}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(var(--primary)/0.08) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "erpShimmer 1.8s ease-in-out infinite",
        }}
      />
    </div>
  )
}

export default Loading
