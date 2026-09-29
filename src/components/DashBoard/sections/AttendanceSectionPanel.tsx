"use client";

import { Users, ArrowDownUp, UserCheck, Activity, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { AttendanceSection, LiveData } from "../hooks/useDashboard";
import { KpiCard } from "../ui/KpiCard";
import { DashCard, SectionMotion, SectionTitle, StatusDot, EmptyState, LivePulse, AnimatedNumber } from "../ui/DashAtoms";
import { HourlyBarChart } from "../ui/DashCharts";

function PulseRing({ count }: { count: number }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* animated rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/30"
          animate={{ scale: [1, 1 + i * 0.25], opacity: [0.6, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
          style={{ width: 80 + i * 24, height: 80 + i * 24 }}
        />
      ))}
      <div className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primary leading-none">
          <AnimatedNumber value={count} />
        </span>
        <span className="text-xs text-muted-foreground">inside</span>
      </div>
    </div>
  );
}

export function AttendanceSectionPanel({
  data,
  live,
}: {
  data: AttendanceSection;
  live?: LiveData | null;
}) {
  const { kpi, hourly_chart, recent_feed } = data;
  const liveInside = live?.attendance?.currently_inside ?? kpi.currently_inside;
  const liveFeed = live?.attendance?.recent_feed ?? recent_feed;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={Users} label="Currently Inside" value={liveInside} delay={0} />
        <KpiCard icon={UserCheck} label="Members Inside" value={kpi.members_inside} delay={0.05} />
        <KpiCard icon={Users} label="Staff Inside" value={kpi.staff_inside} delay={0.1} />
        <KpiCard icon={ArrowDownUp} label="Check-ins Today" value={kpi.total_checkins_today} delay={0.15} />
        <KpiCard icon={ArrowDownUp} label="Check-outs Today" value={kpi.total_checkouts_today} delay={0.2} />
        <KpiCard icon={Users} label="Guests Today" value={kpi.guests_today} delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hero presence widget */}
        <SectionMotion delay={0.3}>
          <DashCard className="p-4 flex flex-col items-center justify-center min-h-[180px] gap-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Currently Inside
            </p>
            <PulseRing count={liveInside} />
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-foreground">{kpi.members_inside}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-sm font-bold text-foreground">{kpi.staff_inside}</p>
                <p className="text-xs text-muted-foreground">Staff</p>
              </div>
            </div>
          </DashCard>
        </SectionMotion>

        {/* Hourly traffic */}
        <SectionMotion delay={0.35} className="lg:col-span-2">
          <DashCard className="p-4">
            <SectionTitle title="Hourly Traffic" subtitle="Check-ins per hour today" />
            {hourly_chart.length > 0 ? (
              <HourlyBarChart data={hourly_chart} dataKey="checkins" name="Check-ins" />
            ) : (
              <EmptyState message="No data yet" />
            )}
          </DashCard>
        </SectionMotion>
      </div>

      {/* Recent feed */}
      <SectionMotion delay={0.4}>
        <DashCard className="p-4">
          <SectionTitle
            title="Recent Gate Activity"
            subtitle="Last 10 check-in/out events"
            action={<LivePulse />}
          />
          {liveFeed.length > 0 ? (
            <div className="divide-y divide-border">
              {liveFeed.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                    {r.name[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{r.subject_type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <StatusDot status={r.is_inside ? "active" : "closed"} />
                      <span className="text-xs text-muted-foreground">
                        {r.is_inside ? "Inside" : "Left"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/60">
                      {new Date(r.check_in).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No activity recorded today" />
          )}
        </DashCard>
      </SectionMotion>
    </div>
  );
}
