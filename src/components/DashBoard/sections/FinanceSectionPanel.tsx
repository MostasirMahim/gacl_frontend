"use client";

import { DollarSign, TrendingUp, AlertCircle, Receipt, CheckCircle, CreditCard } from "lucide-react";
import { FinanceSection } from "../hooks/useDashboard";
import { KpiCard } from "../ui/KpiCard";
import { DashCard, SectionMotion, SectionTitle, EmptyState } from "../ui/DashAtoms";
import { MembershipDonutChart } from "../ui/DashCharts";
import Link from "next/link";

function fmt(n: number) {
  if (n >= 1_000_000) return `৳${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `৳${(n / 1_000).toFixed(1)}K`;
  return `৳${n.toFixed(0)}`;
}

export function FinanceSectionPanel({ data }: { data: FinanceSection }) {
  const { kpi, invoice_status_chart, top_debtors } = data;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={TrendingUp} label="Revenue MTD" value={kpi.revenue_mtd} prefix="৳" decimals={0} delay={0} />
        <KpiCard icon={DollarSign} label="Sales MTD" value={kpi.sales_mtd} prefix="৳" decimals={0} delay={0.05} />
        <KpiCard icon={AlertCircle} label="Outstanding Dues" value={kpi.total_outstanding_dues} prefix="৳" decimals={0} delay={0.1} />
        <KpiCard icon={Receipt} label="Total Invoices" value={kpi.total_invoices} delay={0.15} />
        <KpiCard icon={AlertCircle} label="Unpaid Invoices" value={kpi.unpaid_invoices} delay={0.2} />
        <KpiCard icon={CheckCircle} label="Paid Invoices" value={kpi.paid_invoices} delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionMotion delay={0.3}>
          <DashCard className="p-4">
            <SectionTitle
              title="Invoice Status Breakdown"
              subtitle="Distribution across all invoices"
            />
            {invoice_status_chart.some(d => d.count > 0) ? (
              <MembershipDonutChart
                data={invoice_status_chart
                  .filter(d => d.count > 0)
                  .map(d => ({ membership_type: d.status, total: d.count }))}
              />
            ) : (
              <EmptyState message="No invoice data" />
            )}
          </DashCard>
        </SectionMotion>

        <SectionMotion delay={0.35}>
          <DashCard className="p-4">
            <SectionTitle
              title="Top Outstanding Balances"
              subtitle="Members with highest overdue amounts"
              action={
                <Link href="/mfm/view_member_dues" className="text-xs text-primary hover:underline">
                  View all →
                </Link>
              }
            />
            {top_debtors.length > 0 ? (
              <div className="divide-y divide-border">
                {top_debtors.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center uppercase">
                        {(d.member__first_name?.[0] || "") + (d.member__last_name?.[0] || "")}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {d.member__first_name} {d.member__last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{d.member__member_ID}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-destructive">
                      {fmt(d.overdue_amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No outstanding balances" />
            )}
          </DashCard>
        </SectionMotion>
      </div>
    </div>
  );
}
