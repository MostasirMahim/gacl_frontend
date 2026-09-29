"use client";

import { Users, UserCheck, UserX, UserPlus, Clock, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { MemberSection } from "../hooks/useDashboard";
import { KpiCard } from "../ui/KpiCard";
import {
  DashCard,
  SectionMotion,
  SectionTitle,
  StatusDot,
  EmptyState,
} from "../ui/DashAtoms";
import { MemberGrowthChart, MembershipDonutChart } from "../ui/DashCharts";
import Link from "next/link";

export function MemberSectionPanel({ data }: { data: MemberSection }) {
  const { kpi, growth_chart, type_breakdown, pending_approval_queue, upcoming_birthdays } = data;

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={Users} label="Total Members" value={kpi.total_members} delay={0} />
        <KpiCard icon={UserCheck} label="Active Members" value={kpi.active_members} delay={0.05} />
        <KpiCard icon={UserX} label="Pending Approval" value={kpi.pending_approval_members} delay={0.1} />
        <KpiCard icon={UserX} label="Pending Status" value={kpi.pending_status_members} delay={0.15} />
        <KpiCard icon={Users} label="Inactive" value={kpi.inactive_members} delay={0.2} />
        <KpiCard icon={UserPlus} label="New This Month" value={kpi.new_this_month} delay={0.25} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionMotion delay={0.3} className="lg:col-span-2">
          <DashCard className="p-4">
            <SectionTitle
              title="Member Growth"
              subtitle="New members per month (last 12 months)"
            />
            {growth_chart.length > 0 ? (
              <MemberGrowthChart data={growth_chart} />
            ) : (
              <EmptyState message="No growth data" />
            )}
          </DashCard>
        </SectionMotion>

        <SectionMotion delay={0.35}>
          <DashCard className="p-4">
            <SectionTitle
              title="Membership Types"
              subtitle="Distribution by type"
            />
            {type_breakdown.length > 0 ? (
              <MembershipDonutChart
                data={type_breakdown.map((t) => ({
                  membership_type: t.membership_type || "Unknown",
                  total: t.total,
                }))}
              />
            ) : (
              <EmptyState message="No type data" />
            )}
          </DashCard>
        </SectionMotion>
      </div>

      {/* Pending queue + Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionMotion delay={0.4}>
          <DashCard className="p-4">
            <SectionTitle
              title="Pending Approvals"
              subtitle={`${kpi.pending_approval_members} applications awaiting review`}
              action={
                <Link
                  href="/members/pending"
                  className="text-xs text-primary hover:underline"
                >
                  View all →
                </Link>
              }
            />
            {pending_approval_queue.length > 0 ? (
              <div className="space-y-0 divide-y divide-border">
                {pending_approval_queue.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* initials avatar */}
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                        {(m.first_name[0] || "") + (m.last_name[0] || "")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate text-foreground text-xs">
                          {m.first_name} {m.last_name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {m["membership_type__name"] || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {m.created_at
                          ? new Date(m.created_at).toLocaleDateString()
                          : "—"}
                      </span>
                      <Link
                        href={`/members/pending`}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-sm hover:bg-primary/20 transition-colors font-medium"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No pending approvals" />
            )}
          </DashCard>
        </SectionMotion>

        <SectionMotion delay={0.45}>
          <DashCard className="p-4">
            <SectionTitle
              title="Upcoming Birthdays"
              subtitle="Next 7 days"
              action={<Gift size={14} className="text-muted-foreground" />}
            />
            {upcoming_birthdays.length > 0 ? (
              <div className="space-y-0 divide-y divide-border">
                {upcoming_birthdays.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                        {(b.first_name[0] || "") + (b.last_name[0] || "")}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {b.first_name} {b.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.member_ID}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {b.date_of_birth
                        ? new Date(b.date_of_birth).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No upcoming birthdays" />
            )}
          </DashCard>
        </SectionMotion>
      </div>
    </div>
  );
}
