"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import useGetKitchenOrders from "@/hooks/data/useGetKitchenOrders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";
import {
  ChefHat,
  Clock,
  Volume2,
  VolumeX,
  Flame,
  DoorOpen,
  UtensilsCrossed,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NEXT_STATUS: Record<string, string> = {
  confirmed: "preparing",
  preparing: "ready",
  ready: "served",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Start Cooking",
  preparing: "Mark Ready",
  ready: "Mark Served",
};

function playKitchenChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Ignore audio permission errors
  }
}

export default function KitchenDisplay({ restaurantId }: { restaurantId?: number }) {
  const { data, isLoading } = useGetKitchenOrders(restaurantId);
  const queryClient = useQueryClient();
  const orders: any[] = data?.data || [];

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ticketLimit, setTicketLimit] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"expanded" | "scrollable">("expanded");
  const previousCountRef = useRef(orders.length);

  // Sound alert on new incoming orders
  useEffect(() => {
    if (orders.length > previousCountRef.current && soundEnabled && previousCountRef.current !== 0) {
      playKitchenChime();
    }
    previousCountRef.current = orders.length;
  }, [orders.length, soundEnabled]);

  // Unique venues list
  const venues = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.restaurant_name) set.add(o.restaurant_name);
      else if (o.restaurant?.name) set.add(o.restaurant.name);
    });
    return Array.from(set);
  }, [orders]);

  // Filtered orders by venue and search query
  const filteredOrders = useMemo(() => {
    let res = orders;
    if (selectedVenue !== "all") {
      res = res.filter(
        (o) => (o.restaurant_name || o.restaurant?.name) === selectedVenue
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      res = res.filter((o) => {
        const orderNum = o.order_number?.toLowerCase() || "";
        const roomNum = o.room_number?.toLowerCase() || "";
        const member = o.member_name?.toLowerCase() || "";
        const items = (o.items || [])
          .map((it: any) => it.item_name?.toLowerCase() || "")
          .join(" ");
        return (
          orderNum.includes(q) ||
          roomNum.includes(q) ||
          member.includes(q) ||
          items.includes(q)
        );
      });
    }
    return res;
  }, [orders, selectedVenue, searchQuery]);

  // Group by stage
  const confirmedOrders = filteredOrders.filter((o) => o.status === "confirmed");
  const preparingOrders = filteredOrders.filter((o) => o.status === "preparing");
  const readyOrders = filteredOrders.filter((o) => o.status === "ready");

  // Apply ticket limit if not set to "all"
  const visibleConfirmed = useMemo(() => {
    if (ticketLimit === "all") return confirmedOrders;
    return confirmedOrders.slice(0, Number(ticketLimit));
  }, [confirmedOrders, ticketLimit]);

  const visiblePreparing = useMemo(() => {
    if (ticketLimit === "all") return preparingOrders;
    return preparingOrders.slice(0, Number(ticketLimit));
  }, [preparingOrders, ticketLimit]);

  const visibleReady = useMemo(() => {
    if (ticketLimit === "all") return readyOrders;
    return readyOrders.slice(0, Number(ticketLimit));
  }, [readyOrders, ticketLimit]);

  async function advance(orderId: number, target: string) {
    try {
      await axiosInstance.patch(
        `/api/restaurants/v1/restaurants/kitchen/orders/${orderId}/status/`,
        { target_status: target }
      );
      toast.success(`Order #${orderId} moved to ${target}`);
      queryClient.invalidateQueries({ queryKey: ["getKitchenOrders"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Status update failed");
    }
  }

  function getElapsedMinutes(createdAt: string) {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diffMs / 60000);
  }

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Control Header: Top Info Row + Dedicated Full Row for Controls ── */}
      <div className="p-3.5 sm:p-4 bg-card border border-border/80 rounded-xl shadow-xs space-y-3">
        {/* Row 1: Title, Live Status Badge, and Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs shrink-0">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-foreground leading-none">
                  Kitchen Display System (KDS)
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Showing {filteredOrders.length} active tickets across kitchen pipelines
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Audio Alert & Refresh */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`h-8 px-2.5 text-xs font-medium border-border/80 gap-1.5 cursor-pointer ${
                soundEnabled ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Audio Alert On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["getKitchenOrders"] })}
              className="h-8 px-2.5 text-xs font-medium border-border/80 gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Dedicated Full Row for New Things (Search, Venue, Limit, and Full List/Scrollable) */}
        <div className="pt-2.5 border-t border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Quick Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, room, member, dish..."
              className="w-full h-8 bg-muted/40 border border-border/80 rounded-md pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            />
          </div>

          {/* Right: Venue selector, Limit, and View Mode Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Venue selector */}
            {venues.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                  Venue:
                </span>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="h-8 text-xs bg-muted/40 border border-border/80 rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer"
                >
                  <option value="all">All Kitchens</option>
                  {venues.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Limit selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                Limit:
              </span>
              <select
                value={ticketLimit}
                onChange={(e) => setTicketLimit(e.target.value)}
                className="h-8 text-xs bg-muted/40 border border-border/80 rounded-md px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer"
              >
                <option value="all">Show All ({filteredOrders.length})</option>
                <option value="10">10 / Column</option>
                <option value="20">20 / Column</option>
                <option value="50">50 / Column</option>
              </select>
            </div>

            {/* View Mode: Full List vs Scrollable with PRIMARY active color */}
            <div className="flex items-center border border-border/80 rounded-lg bg-muted/40 p-0.5">
              <button
                onClick={() => setViewMode("expanded")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  viewMode === "expanded"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Full List (Continuous scrolling down page)"
              >
                Full List
              </button>
              <button
                onClick={() => setViewMode("scrollable")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  viewMode === "scrollable"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Scrollable Lanes"
              >
                Scrollable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3-Stage Pipeline Kanban Section with Dedicated Background Container ── */}
      <div className="bg-card/75 dark:bg-card/45 border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full items-start">
          {/* Column 1: New / Confirmed */}
          <div className="flex flex-col bg-muted/60 dark:bg-muted/30 border border-border/70 rounded-xl p-3.5 shadow-xs min-h-[460px]">
            <div className="p-2.5 mb-3 bg-card border border-border/70 rounded-lg shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  1. New / In Queue
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                {ticketLimit !== "all" && confirmedOrders.length > visibleConfirmed.length && (
                  <span className="text-[10px] text-muted-foreground">
                    Showing {visibleConfirmed.length} of
                  </span>
                )}
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {confirmedOrders.length}
                </span>
              </div>
            </div>

            <div
              className={`space-y-3 min-h-[300px] ${
                viewMode === "scrollable"
                  ? "overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar pr-1.5 pb-2"
                  : "pr-0.5 pb-2"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {visibleConfirmed.map((o) => (
                  <KdsTicketCard
                    key={o.id}
                    order={o}
                    elapsedMin={getElapsedMinutes(o.created_at)}
                    onAdvance={() => advance(o.id, NEXT_STATUS[o.status])}
                    statusLabel={STATUS_LABEL[o.status]}
                    stage="confirmed"
                  />
                ))}
              </AnimatePresence>

              {ticketLimit !== "all" && confirmedOrders.length > visibleConfirmed.length && (
                <button
                  onClick={() => setTicketLimit("all")}
                  className="w-full py-2 text-xs font-semibold text-primary hover:underline text-center bg-card/60 rounded-lg border border-dashed border-primary/30 cursor-pointer"
                >
                  Show remaining {confirmedOrders.length - visibleConfirmed.length} orders
                </button>
              )}

              {confirmedOrders.length === 0 && (
                <div className="flex-1 my-auto flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border-2 border-dashed border-border/70 bg-card/40 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground">
                    <UtensilsCrossed className="w-5 h-5 opacity-60" />
                  </div>
                  <p className="text-xs font-semibold text-foreground/80">
                    No orders waiting in queue
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-[200px]">
                    New incoming orders from members and waiters will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Preparing / Cooking */}
          <div className="flex flex-col bg-muted/60 dark:bg-muted/30 border border-border/70 rounded-xl p-3.5 shadow-xs min-h-[460px]">
            <div className="p-2.5 mb-3 bg-card border border-border/70 rounded-lg shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  2. Cooking / In Prep
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                {ticketLimit !== "all" && preparingOrders.length > visiblePreparing.length && (
                  <span className="text-[10px] text-muted-foreground">
                    Showing {visiblePreparing.length} of
                  </span>
                )}
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {preparingOrders.length}
                </span>
              </div>
            </div>

            <div
              className={`space-y-3 min-h-[300px] ${
                viewMode === "scrollable"
                  ? "overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar pr-1.5 pb-2"
                  : "pr-0.5 pb-2"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {visiblePreparing.map((o) => (
                  <KdsTicketCard
                    key={o.id}
                    order={o}
                    elapsedMin={getElapsedMinutes(o.created_at)}
                    onAdvance={() => advance(o.id, NEXT_STATUS[o.status])}
                    statusLabel={STATUS_LABEL[o.status]}
                    stage="preparing"
                  />
                ))}
              </AnimatePresence>

              {ticketLimit !== "all" && preparingOrders.length > visiblePreparing.length && (
                <button
                  onClick={() => setTicketLimit("all")}
                  className="w-full py-2 text-xs font-semibold text-primary hover:underline text-center bg-card/60 rounded-lg border border-dashed border-primary/30 cursor-pointer"
                >
                  Show remaining {preparingOrders.length - visiblePreparing.length} orders
                </button>
              )}

              {preparingOrders.length === 0 && (
                <div className="flex-1 my-auto flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border-2 border-dashed border-border/70 bg-card/40 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground">
                    <Flame className="w-5 h-5 opacity-60 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-foreground/80">
                    No tickets currently cooking
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-[200px]">
                    Tickets moved from the queue will appear here for preparation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Ready for Service */}
          <div className="flex flex-col bg-muted/60 dark:bg-muted/30 border border-border/70 rounded-xl p-3.5 shadow-xs min-h-[460px]">
            <div className="p-2.5 mb-3 bg-card border border-border/70 rounded-lg shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  3. Ready for Service
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                {ticketLimit !== "all" && readyOrders.length > visibleReady.length && (
                  <span className="text-[10px] text-muted-foreground">
                    Showing {visibleReady.length} of
                  </span>
                )}
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {readyOrders.length}
                </span>
              </div>
            </div>

            <div
              className={`space-y-3 min-h-[300px] ${
                viewMode === "scrollable"
                  ? "overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar pr-1.5 pb-2"
                  : "pr-0.5 pb-2"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {visibleReady.map((o) => (
                  <KdsTicketCard
                    key={o.id}
                    order={o}
                    elapsedMin={getElapsedMinutes(o.created_at)}
                    onAdvance={() => advance(o.id, NEXT_STATUS[o.status])}
                    statusLabel={STATUS_LABEL[o.status]}
                    stage="ready"
                  />
                ))}
              </AnimatePresence>

              {ticketLimit !== "all" && readyOrders.length > visibleReady.length && (
                <button
                  onClick={() => setTicketLimit("all")}
                  className="w-full py-2 text-xs font-semibold text-primary hover:underline text-center bg-card/60 rounded-lg border border-dashed border-primary/30 cursor-pointer"
                >
                  Show remaining {readyOrders.length - visibleReady.length} orders
                </button>
              )}

              {readyOrders.length === 0 && (
                <div className="flex-1 my-auto flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border-2 border-dashed border-border/70 bg-card/40 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-60" />
                  </div>
                  <p className="text-xs font-semibold text-foreground/80">
                    No orders waiting for pickup
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-[200px]">
                    Dishes finished cooking ready to be served or delivered to rooms
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KdsTicketCard({
  order,
  elapsedMin,
  onAdvance,
  statusLabel,
  stage,
}: {
  order: any;
  elapsedMin: number;
  onAdvance: () => void;
  statusLabel?: string;
  stage: "confirmed" | "preparing" | "ready";
}) {
  const isLate = elapsedMin >= 20;
  const isWarning = elapsedMin >= 10 && elapsedMin < 20;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`p-3.5 bg-card border rounded-xl shadow-xs flex flex-col gap-3 relative overflow-hidden group ${
        isLate
          ? "border-rose-500/60 ring-1 ring-rose-500/30"
          : isWarning
          ? "border-amber-500/50"
          : "border-border/80"
      }`}
    >
      {/* Elapsed indicator stripe */}
      {isLate && (
        <div className="absolute top-0 inset-x-0 h-1 bg-rose-500 animate-pulse" />
      )}

      {/* Ticket Header: Order #, Venue, and Timer */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm font-bold text-foreground">
              {order.order_number}
            </span>
            {order.restaurant_name && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {order.restaurant_name}
              </span>
            )}
          </div>
          {/* Member Name */}
          {order.member_name && (
            <p className="text-xs font-semibold text-foreground/90 mt-0.5 truncate max-w-[170px]">
              {order.member_name}
            </p>
          )}
        </div>

        {/* Elapsed Timer badge */}
        <div
          className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            isLate
              ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
              : isWarning
              ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>{elapsedMin}m</span>
        </div>
      </div>

      {/* Delivery Destination: Room vs Dine-in Table */}
      <div className="flex items-center gap-2 text-xs">
        {order.serve_location === "room" ? (
          <span className="inline-flex items-center gap-1 text-sky-500 font-semibold bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
            <DoorOpen className="w-3.5 h-3.5" />
            Room {order.room_number || "—"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-foreground/80 font-semibold bg-muted px-2 py-0.5 rounded-md border border-border">
            <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
            Dine-In Restaurant
          </span>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-1.5 py-1 border-t border-border/50 text-xs">
        {order.items?.map((it: any) => (
          <div key={it.id} className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 min-w-0">
              <span className="font-mono font-bold text-primary bg-primary/10 px-1 rounded text-[11px] shrink-0">
                {it.quantity}×
              </span>
              <span className="font-medium text-foreground truncate">
                {it.item_name}
              </span>
            </div>

            {it.spicy_level_name && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-orange-500 shrink-0 bg-orange-500/10 px-1 py-0.5 rounded">
                <Flame className="w-2.5 h-2.5" />
                {it.spicy_level_name}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Special Chef Note */}
      {order.note && (
        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400">
          <span className="font-bold">Note: </span>
          {order.note}
        </div>
      )}

      {/* Action Advance Button */}
      {statusLabel && (
        <Button
          size="sm"
          onClick={onAdvance}
          className={`w-full h-8 text-xs font-semibold gap-1.5 mt-1 transition-all cursor-pointer ${
            stage === "confirmed"
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : stage === "preparing"
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          <span>{statusLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      )}
    </motion.div>
  );
}
