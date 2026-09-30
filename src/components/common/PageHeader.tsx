import React, { ReactNode, useId } from "react";
import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  description?: string | ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  icon?: LucideIcon | ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: "card" | "plain";
  /** Optional custom right-side decorative illustration */
  illustration?: ReactNode;
}

function PageHeaderShadesBg() {
  const rawId = useId();
  // Sanitize React useId for safe SVG url(#...) references
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const wave1Id = `phWave1_${id}`;
  const wave2Id = `phWave2_${id}`;
  const glowId = `phGlow_${id}`;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
      {/* Base subtle primary tint gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-transparent to-primary/[0.06] pointer-events-none" />

      {/* Multi-shade organic wave curves matching Dashboard */}
      <svg
        className="absolute inset-0 w-full h-full min-h-[140px] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 260"
        fill="none"
      >
        <defs>
          {/* Wave Gradient 1: Sky to Primary to Indigo */}
          <linearGradient id={wave1Id} x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="12%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="48%" stopColor="hsl(var(--primary))" stopOpacity="0.09" />
            <stop offset="85%" stopColor="#818cf8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
          </linearGradient>

          {/* Wave Gradient 2: Soft Primary to Cyan */}
          <linearGradient id={wave2Id} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
            <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.03" />
          </linearGradient>

          {/* Ambient radial glow under the right controls / illustration */}
          <radialGradient id={glowId} cx="82%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.14" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow behind right controls */}
        <ellipse cx="1180" cy="130" rx="360" ry="130" fill={`url(#${glowId})`} />

        {/* Back smooth continuous wave */}
        <path
          d="M-300 260 L-300 170 C 0 140, 200 240, 500 150 C 800 60, 1000 190, 1300 120 C 1500 70, 1600 130, 1800 140 L1800 260 Z"
          fill={`url(#${wave1Id})`}
        />

        {/* Fore smooth wave */}
        <path
          d="M-300 260 L-300 210 C 50 190, 300 120, 600 200 C 900 280, 1150 140, 1400 180 C 1550 200, 1700 160, 1800 180 L1800 260 Z"
          fill={`url(#${wave2Id})`}
        />
      </svg>

      {/* Ambient background soft blur spots */}
      <div className="absolute -top-12 left-6 w-80 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 right-1/4 w-80 h-36 bg-sky-500/8 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

export default function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  icon: Icon,
  badge,
  actions,
  children,
  className,
  variant = "card",
  illustration,
}: PageHeaderProps) {
  const sub = subtitle || description;

  const renderIcon = () => {
    if (!Icon) return null;

    let content: ReactNode = null;
    if (React.isValidElement(Icon)) {
      content = Icon;
    } else if (
      typeof Icon === "function" ||
      (typeof Icon === "object" && Icon !== null && ("render" in Icon || "$$typeof" in Icon))
    ) {
      const IconComponent = Icon as React.ComponentType<{ className?: string }>;
      content = <IconComponent className="w-5 h-5" />;
    } else if (typeof Icon === "string" || typeof Icon === "number") {
      content = Icon;
    }

    if (!content) return null;

    return (
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs backdrop-blur-xs">
        {content}
      </div>
    );
  };

  const isCard = variant === "card";

  return (
    <div
      className={cn(
        isCard
          ? "relative overflow-hidden rounded-md bg-card/95 dark:bg-card/85 border border-border/80 border-b-1 border-b-primary/20 dark:border-b-primary/20 shadow-xs p-4 sm:p-5 transition-all"
          : "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-1 border-border/80 border-b-primary/20 transition-colors",
        className
      )}
    >
      {isCard && <PageHeaderShadesBg />}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          {/* Breadcrumb Trail */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"
            >
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-foreground transition-colors font-medium truncate max-w-[140px] sm:max-w-none"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className={cn(
                          "truncate max-w-[180px] sm:max-w-none",
                          isLast
                            ? "text-foreground font-semibold"
                            : "font-medium"
                        )}
                      >
                        {crumb.label}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            {renderIcon()}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-[family-name:var(--font-heading)]">
                  {title}
                </h1>
                {badge && <div className="shrink-0">{badge}</div>}
              </div>

              {/* Subtitle / Description */}
              {sub && (
                <p className="text-xs sm:text-sm text-foreground mt-0.5 line-clamp-2">
                  {sub}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right-side Action Controls or Illustration */}
        {(actions || illustration) && (
          <div className="flex items-center gap-3 flex-wrap shrink-0">
            {actions}
            {illustration && (
              <div className="hidden md:flex items-end justify-end shrink-0 pointer-events-none select-none">
                {illustration}
              </div>
            )}
          </div>
        )}
      </div>

      {children && (
        <div className="relative z-10 mt-3 pt-3 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  );
}
