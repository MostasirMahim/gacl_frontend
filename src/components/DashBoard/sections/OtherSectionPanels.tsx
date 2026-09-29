"use client";

import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { EventsSection, ReservationsSection, PayrollSection, VendorSection, SystemSection } from "../hooks/useDashboard";
import { KpiCard } from "../ui/KpiCard";
import { DashCard, SectionMotion, SectionTitle, StatusDot, EmptyState } from "../ui/DashAtoms";
import { Users, Layers, Activity, Package, Store, FileText, Briefcase, TrendingUp } from "lucide-react";
import Link from "next/link";

// ─── Events Section ──────────────────────────────────────────────────────────
export function EventsSectionPanel({ data }: { data: EventsSection }) {
  const { kpi, upcoming_events_list, status_chart } = data;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <KpiCard icon={Calendar} label="Total Active" value={kpi.total_active_events} delay={0} />
        <KpiCard icon={Clock} label="Upcoming" value={kpi.upcoming_events} delay={0.05} />
        <KpiCard icon={Calendar} label="This Month" value={kpi.events_this_month} delay={0.1} />
      </div>
      <SectionMotion delay={0.15}>
        <DashCard className="p-4">
          <SectionTitle title="Upcoming Events" subtitle="Next 5 scheduled events" action={
            <Link href="/events" className="text-xs text-primary hover:underline">View all →</Link>
          } />
          {upcoming_events_list.length > 0 ? (
            <div className="divide-y divide-border">
              {upcoming_events_list.map((e) => (
                <div key={e.id} className="flex items-start gap-3 py-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.start_date ? new Date(e.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StatusDot status={e.status} />
                    <span className="text-xs text-muted-foreground capitalize">{e.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No upcoming events" />}
        </DashCard>
      </SectionMotion>
    </div>
  );
}

// ─── Reservations Section ────────────────────────────────────────────────────
export function ReservationsSectionPanel({ data }: { data: ReservationsSection }) {
  const { kpi, resource_status, upcoming_reservations } = data;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={Calendar} label="Total Today" value={kpi.total_today} delay={0} />
        <KpiCard icon={Clock} label="Confirmed" value={kpi.confirmed_today} delay={0.05} />
        <KpiCard icon={Clock} label="Pending Payment" value={kpi.pending_payment} delay={0.1} />
        <KpiCard icon={Calendar} label="Cancelled" value={kpi.cancelled_today} delay={0.15} />
        <KpiCard icon={Users} label="Active Now" value={kpi.active_now} delay={0.2} />
        <KpiCard icon={Clock} label="Next 2 Hours" value={kpi.upcoming_2h} delay={0.25} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionMotion delay={0.3}>
          <DashCard className="p-4">
            <SectionTitle title="Facility Status" subtitle="Current resource availability" />
            {resource_status.length > 0 ? (
              <div className="divide-y divide-border">
                {resource_status.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-xs font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{r.resource_type.replace("_", " ")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{r.bookings_today} bookings</span>
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={r.status} />
                        <span className="text-xs capitalize text-muted-foreground">{r.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState message="No resources configured" />}
          </DashCard>
        </SectionMotion>
        <SectionMotion delay={0.35}>
          <DashCard className="p-4">
            <SectionTitle title="Upcoming Reservations" subtitle="Next 10 bookings" action={
              <Link href="/reservations" className="text-xs text-primary hover:underline">View all →</Link>
            } />
            {upcoming_reservations.length > 0 ? (
              <div className="divide-y divide-border max-h-64 overflow-y-auto no-scrollbar">
                {upcoming_reservations.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                      <MapPin size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {r["member__first_name"]} {r["member__last_name"]}
                      </p>
                      <p className="text-xs text-muted-foreground">{r["resource__name"]}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-foreground font-medium">
                        {r.start_time ? new Date(r.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        <StatusDot status={r.status} />
                        <span className="text-xs text-muted-foreground capitalize">{r.status.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState message="No upcoming reservations" />}
          </DashCard>
        </SectionMotion>
      </div>
    </div>
  );
}

// ─── Payroll Section ─────────────────────────────────────────────────────────
export function PayrollSectionPanel({ data }: { data: PayrollSection }) {
  const { kpi } = data;
  const statusColor: Record<string, string> = {
    paid: "text-emerald-500",
    processed: "text-primary",
    draft: "text-amber-500",
    not_run: "text-muted-foreground",
    cancelled: "text-destructive",
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={Users} label="Total Staff" value={kpi.total_staff} delay={0} />
        <KpiCard icon={FileText} label="Pending Payslips" value={kpi.pending_payslips} delay={0.05} />
        <KpiCard icon={TrendingUp} label="Payroll Total" value={kpi.current_month_payroll_total} prefix="৳" delay={0.1} />
        <KpiCard icon={Briefcase} label="Active Loans" value={kpi.active_loans_count} delay={0.15} />
        <KpiCard icon={TrendingUp} label="Loan Outstanding" value={kpi.total_loan_outstanding} prefix="৳" delay={0.2} />
        <SectionMotion delay={0.25}>
          <DashCard className="p-4 flex flex-col gap-1 justify-center h-full">
            <p className="text-xs text-muted-foreground font-medium">Payroll Status</p>
            <p className={`text-lg font-bold capitalize ${statusColor[kpi.current_month_payroll_status] || "text-foreground"}`}>
              {kpi.current_month_payroll_status.replace("_", " ")}
            </p>
            <p className="text-xs text-muted-foreground">This month</p>
          </DashCard>
        </SectionMotion>
      </div>
    </div>
  );
}

// ─── Vendor Section ──────────────────────────────────────────────────────────
export function VendorSectionPanel({ data }: { data: VendorSection }) {
  const { kpi } = data;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard icon={Store} label="Total Vendors" value={kpi.total_vendors} delay={0} />
      <KpiCard icon={Store} label="Active Contracts" value={kpi.active_contracts} delay={0.05} />
      <KpiCard icon={Clock} label="Pending Offers" value={kpi.pending_offers} delay={0.1} />
      <KpiCard icon={Layers} label="Service Categories" value={kpi.total_service_categories} delay={0.15} />
      <KpiCard icon={Package} label="Active Products" value={kpi.total_active_products} delay={0.2} />
    </div>
  );
}

// ─── System Section ──────────────────────────────────────────────────────────
export function SystemSectionPanel({ data }: { data: SystemSection }) {
  const { kpi, recent_audit_log } = data;
  const severityColor: Record<string, string> = {
    info: "text-primary",
    warning: "text-amber-500",
    error: "text-destructive",
    critical: "text-destructive",
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KpiCard icon={Users} label="Total Users" value={kpi.total_users} delay={0} />
        <KpiCard icon={Briefcase} label="Staff Users" value={kpi.staff_users} delay={0.05} />
        <KpiCard icon={Users} label="Member Users" value={kpi.member_users} delay={0.1} />
        <KpiCard icon={Layers} label="Total Groups" value={kpi.total_groups} delay={0.15} />
        <KpiCard icon={Activity} label="Active Today" value={kpi.active_today} delay={0.2} />
      </div>
      <SectionMotion delay={0.25}>
        <DashCard className="p-4">
          <SectionTitle title="Recent Audit Log" subtitle="Last 10 system events" action={
            <Link href="/activity_logs" className="text-xs text-primary hover:underline">View all →</Link>
          } />
          {recent_audit_log.length > 0 ? (
            <div className="divide-y divide-border">
              {recent_audit_log.map((log, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    log.severity === "info" ? "bg-primary" :
                    log.severity === "warning" ? "bg-amber-500" : "bg-destructive"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{log.verb || log.path}</p>
                    <p className="text-xs text-muted-foreground">{log.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground/60 shrink-0">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No audit events" />}
        </DashCard>
      </SectionMotion>
    </div>
  );
}
