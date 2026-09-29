"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardSummary, useDashboardLive } from "@/components/DashBoard/hooks/useDashboard";
import { DashHeader } from "@/components/DashBoard/ui/DashHeader";
import { Skeleton } from "@/components/DashBoard/ui/DashAtoms";
import { MemberSectionPanel } from "@/components/DashBoard/sections/MemberSectionPanel";
import { FinanceSectionPanel } from "@/components/DashBoard/sections/FinanceSectionPanel";
import { RestaurantSectionPanel } from "@/components/DashBoard/sections/RestaurantSectionPanel";
import { AttendanceSectionPanel } from "@/components/DashBoard/sections/AttendanceSectionPanel";
import {
  EventsSectionPanel,
  ReservationsSectionPanel,
  PayrollSectionPanel,
  VendorSectionPanel,
  SystemSectionPanel,
} from "@/components/DashBoard/sections/OtherSectionPanels";

// Determine if any operational section exists (gate/restaurant) to enable live polling
const LIVE_SECTIONS = new Set(["restaurant", "attendance"]);

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <Skeleton className="h-24 w-full rounded-xl" />
      {/* KPI row skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      {/* Charts row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      {/* Table row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    </div>
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-foreground mb-1">Failed to load dashboard</h3>
        <p className="text-xs text-muted-foreground max-w-sm">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Try again
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardSummary();

  // Determine active section from the first returned section
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = data?.sections ?? [];
  const resolvedActive =
    activeSection && sections.includes(activeSection)
      ? activeSection
      : sections[0] ?? "";

  // Enable live feed only when operational sections are present
  const liveEnabled = useMemo(
    () => sections.some((s) => LIVE_SECTIONS.has(s)),
    [sections]
  );
  const liveData = useDashboardLive(liveEnabled, 30_000);

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data)
    return <DashboardError message={error ?? "Unknown error"} onRetry={refetch} />;

  const d = data.data;

  return (
    <div className="space-y-0">
      <DashHeader
        sections={sections}
        activeSection={resolvedActive}
        onSectionChange={setActiveSection}
        isLive={liveEnabled && !!liveData}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedActive}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {resolvedActive === "member" && d.member && (
            <MemberSectionPanel data={d.member} />
          )}
          {resolvedActive === "finance" && d.finance && (
            <FinanceSectionPanel data={d.finance} />
          )}
          {resolvedActive === "restaurant" && d.restaurant && (
            <RestaurantSectionPanel data={d.restaurant} live={liveData} />
          )}
          {resolvedActive === "attendance" && d.attendance && (
            <AttendanceSectionPanel data={d.attendance} live={liveData} />
          )}
          {resolvedActive === "events" && d.events && (
            <EventsSectionPanel data={d.events} />
          )}
          {resolvedActive === "reservations" && d.reservations && (
            <ReservationsSectionPanel data={d.reservations} />
          )}
          {resolvedActive === "payroll" && d.payroll && (
            <PayrollSectionPanel data={d.payroll} />
          )}
          {resolvedActive === "vendor" && d.vendor && (
            <VendorSectionPanel data={d.vendor} />
          )}
          {resolvedActive === "system" && d.system && (
            <SystemSectionPanel data={d.system} />
          )}
          {resolvedActive === "outlet" && d.outlet && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Outlet section is minimal, render KPIs inline */}
              {Object.entries(d.outlet.kpi).map(([key, val], i) => (
                <div
                  key={key}
                  className="bg-card border border-border border-l-2 border-l-primary rounded-xl p-4"
                >
                  <p className="text-2xl font-bold text-foreground">{typeof val === "number" ? val.toLocaleString() : val}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
