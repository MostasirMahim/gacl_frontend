"use client";

import React from "react";
import { Store, Clock, ChefHat, ShoppingBag, TrendingUp, UtensilsCrossed } from "lucide-react";
import { KpiCard } from "@/components/DashBoard/ui/KpiCard";

export interface RestaurantKpiData {
  totalVenues: number;
  openVenues: number;
  activeKitchenOrders: number;
  todayOrders: number;
  todayRevenue: number;
  totalMenuItems: number;
}

export function RestaurantKpiRibbon({ data }: { data: RestaurantKpiData }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard
        icon={Store}
        label="Total Venues"
        value={data.totalVenues}
        sub={`${data.openVenues} open now`}
        delay={0}
      />
      <KpiCard
        icon={Clock}
        label="Open Venues"
        value={data.openVenues}
        sub="Active dining services"
        delay={0.05}
      />
      <KpiCard
        icon={ChefHat}
        label="Kitchen Active"
        value={data.activeKitchenOrders}
        sub="Orders in cooking / prep"
        delay={0.1}
      />
      <KpiCard
        icon={ShoppingBag}
        label="Orders Today"
        value={data.todayOrders}
        sub="Total dining tickets"
        delay={0.15}
      />
      <KpiCard
        icon={TrendingUp}
        label="Revenue Today"
        value={data.todayRevenue}
        prefix="৳"
        sub="Billed restaurant sales"
        delay={0.2}
      />
    </div>
  );
}
