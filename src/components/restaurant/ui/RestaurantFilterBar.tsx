"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, LayoutGrid, Table, ChefHat, RefreshCcw, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RestaurantFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCuisine: string;
  onCuisineChange: (c: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (m: "grid" | "table") => void;
  cuisines: string[];
}

export function RestaurantFilterBar({
  searchQuery,
  onSearchChange,
  selectedCuisine,
  onCuisineChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  cuisines,
}: RestaurantFilterBarProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2.5 sm:p-3 bg-card border border-border/80 rounded-xl shadow-xs">
      {/* Left: Search input & Filters */}
      <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[180px] max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search venues by name, cuisine, address..."
            className="w-full h-9 bg-card border border-border/90 focus:border-primary rounded-lg pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Cuisine Filter */}
        <Select value={selectedCuisine} onValueChange={onCuisineChange}>
          <SelectTrigger className="h-9 w-28 sm:w-32 xl:w-36 text-xs bg-card border-border/90 shrink-0 rounded-lg">
            <SelectValue placeholder="All Cuisines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cuisines</SelectItem>
            {cuisines.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9 w-24 sm:w-26 xl:w-28 text-xs bg-card border-border/90 shrink-0 rounded-lg">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open Now</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right: View Mode & Action Icon Buttons (all uniform h-9 size) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-auto">
        {/* View Switcher (Grid vs Table) */}
        <div className="flex items-center border border-border/90 rounded-lg p-0.5 bg-muted/40 shrink-0 h-9">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`h-7.5 px-2.5 text-xs rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`h-7.5 px-2.5 text-xs rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>

        {/* Subtle vertical divider */}
        <div className="h-4 w-px bg-border/70 hidden sm:block shrink-0 mx-0.5" />

        {/* Refresh Icon Button (h-9 w-9) */}
        <button
          type="button"
          onClick={() => startRefresh(() => router.refresh())}
          title="Refresh venues"
          aria-label="Refresh venues"
          className="h-9 w-9 rounded-lg border border-border/90 bg-card hover:bg-muted text-foreground/80 hover:text-foreground flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>

        {/* Kitchen Display Icon Button (h-9 w-9) */}
        <Link
          href="/restaurant-orders"
          title="Kitchen Display Orders"
          aria-label="Kitchen Display Orders"
          className="h-9 w-9 rounded-lg border border-border/90 bg-card hover:bg-muted text-foreground/80 hover:text-foreground flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <ChefHat className="h-4 w-4 text-primary" />
        </Link>

        {/* Add Venue Icon Button (h-9 w-9) */}
        <Link
          href="/restaurants/add"
          title="Register New Dining Venue"
          aria-label="Register New Dining Venue"
          className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground border border-primary flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
