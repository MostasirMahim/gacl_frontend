"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { AnimatedNumber, HexIcon, TrendBadge, Skeleton } from "./DashAtoms";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  sub?: string;
  href?: string;
  delay?: number;
}

export function KpiCard({
  icon: Icon,
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  trend,
  sub,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="relative bg-card border border-border/80 rounded-2xl p-4 flex flex-col gap-3 overflow-hidden group cursor-default shadow-xs hover:shadow-sm transition-all duration-300"
    >
      {/* Short top-left glowing primary accent pill matching design plan */}
      <div className="absolute top-3.5 left-0 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_12px_hsl(var(--primary))]" />

      {/* subtle background glow */}
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      <div className="flex items-start justify-between">
        <HexIcon size={40}>
          <Icon size={16} />
        </HexIcon>
        <TrendBadge value={trend} />
      </div>

      <div>
        <div className="text-2xl font-bold text-foreground tracking-tight leading-none mb-1">
          <AnimatedNumber
            value={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        </div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        {sub && (
          <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>
        )}
      </div>
    </motion.div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="relative bg-card border border-border/80 rounded-2xl p-4 flex flex-col gap-3 overflow-hidden shadow-xs">
      <div className="absolute top-3.5 left-0 w-1.5 h-8 bg-primary/40 rounded-r-full" />
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="w-16 h-4" />
      </div>
      <div>
        <Skeleton className="w-20 h-7 mb-1" />
        <Skeleton className="w-28 h-3" />
      </div>
    </div>
  );
}
