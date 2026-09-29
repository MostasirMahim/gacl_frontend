"use client";

import { ShoppingBag, Clock, CheckSquare, TrendingUp, ChefHat, Star } from "lucide-react";
import { RestaurantSection, LiveData } from "../hooks/useDashboard";
import { KpiCard } from "../ui/KpiCard";
import { DashCard, SectionMotion, SectionTitle, StatusDot, EmptyState, LivePulse } from "../ui/DashAtoms";
import { HourlyBarChart, OrderStatusDonut, RestaurantRevenueBar } from "../ui/DashCharts";

export function RestaurantSectionPanel({
  data,
  live,
}: {
  data: RestaurantSection;
  live?: LiveData | null;
}) {
  const { kpi, status_chart, hourly_chart, restaurant_revenue, top_items_today } = data;
  const liveOrders = live?.restaurant_live_orders ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={ShoppingBag} label="Orders Today" value={kpi.orders_today} delay={0} />
        <KpiCard icon={Clock} label="In Progress" value={kpi.in_progress} delay={0.05} />
        <KpiCard icon={CheckSquare} label="Billed Today" value={kpi.billed_today} delay={0.1} />
        <KpiCard icon={ShoppingBag} label="Served Today" value={kpi.served_today} delay={0.15} />
        <KpiCard icon={ShoppingBag} label="Cancelled" value={kpi.cancelled_today} delay={0.2} />
        <KpiCard icon={TrendingUp} label="Revenue Today" value={kpi.revenue_today} prefix="৳" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionMotion delay={0.3} className="lg:col-span-2">
          <DashCard className="p-4">
            <SectionTitle title="Hourly Order Volume" subtitle="Orders placed per hour today" />
            {hourly_chart.length > 0 ? (
              <HourlyBarChart data={hourly_chart} dataKey="orders" name="Orders" />
            ) : (
              <EmptyState message="No orders yet today" />
            )}
          </DashCard>
        </SectionMotion>

        <SectionMotion delay={0.35}>
          <DashCard className="p-4">
            <SectionTitle title="Order Status" subtitle="Today's breakdown" />
            <OrderStatusDonut data={status_chart} />
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
              {status_chart.filter(s => s.count > 0).map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <StatusDot status={s.status} />
                  <span className="capitalize">{s.status}</span>
                  <span className="ml-auto font-medium text-foreground">{s.count}</span>
                </div>
              ))}
            </div>
          </DashCard>
        </SectionMotion>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live KDS feed */}
        <SectionMotion delay={0.4}>
          <DashCard className="p-4">
            <SectionTitle
              title="Live Kitchen Orders"
              subtitle="Active orders in real-time"
              action={<LivePulse />}
            />
            {liveOrders.length > 0 ? (
              <div className="space-y-0 divide-y divide-border max-h-52 overflow-y-auto no-scrollbar">
                {liveOrders.map((o) => (
                  <div key={o.order_number} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {o.member_name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">{o.order_number}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{o.restaurant}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-sm capitalize font-medium ${
                          o.status === "preparing"
                            ? "bg-primary/15 text-primary"
                            : o.status === "ready"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : o.status === "confirmed"
                            ? "bg-amber-500/15 text-amber-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No active kitchen orders" />
            )}
          </DashCard>
        </SectionMotion>

        <div className="space-y-4">
          <SectionMotion delay={0.45}>
            <DashCard className="p-4">
              <SectionTitle title="Revenue by Restaurant" subtitle="Today's billed amounts" />
              {restaurant_revenue.length > 0 ? (
                <RestaurantRevenueBar data={restaurant_revenue} />
              ) : (
                <EmptyState message="No revenue data" />
              )}
            </DashCard>
          </SectionMotion>

          <SectionMotion delay={0.5}>
            <DashCard className="p-4">
              <SectionTitle title="Top Items Today" subtitle="Most ordered" action={<Star size={13} className="text-muted-foreground" />} />
              {top_items_today.length > 0 ? (
                <div className="space-y-2">
                  {top_items_today.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4 shrink-0 font-medium">
                        {i + 1}
                      </span>
                      <div className="flex-1 bg-muted/40 rounded-sm overflow-hidden h-4 relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/30 rounded-sm"
                          style={{
                            width: `${
                              top_items_today[0]?.times_ordered
                                ? (item.times_ordered / top_items_today[0].times_ordered) * 100
                                : 0
                            }%`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-foreground truncate">
                          {item.item}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary shrink-0">
                        ×{item.times_ordered}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No items ordered yet" />
              )}
            </DashCard>
          </SectionMotion>
        </div>
      </div>
    </div>
  );
}
