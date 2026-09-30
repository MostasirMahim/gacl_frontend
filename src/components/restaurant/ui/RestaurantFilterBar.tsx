"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus, LayoutGrid, Table, ChefHat, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RefreshButton from "@/components/utils/RefreshButton";

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
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-card border border-border/80 rounded-xl shadow-xs">
      {/* Left: Search input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search restaurant by name, city, or address..."
          className="w-full h-9 bg-muted/40 border border-border/80 rounded-lg pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors font-medium"
        />
      </div>

      {/* Middle: Filters (Cuisine & Status) */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Cuisine Filter */}
        <Select value={selectedCuisine} onValueChange={onCuisineChange}>
          <SelectTrigger className="h-9 w-36 text-xs bg-muted/40 border-border/80">
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
          <SelectTrigger className="h-9 w-32 text-xs bg-muted/40 border-border/80">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open Now</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* View Switcher (Grid vs Table) */}
        <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`h-7 px-2 text-xs rounded-md flex items-center gap-1 transition-all ${
              viewMode === "grid"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("table")}
            className={`h-7 px-2 text-xs rounded-md flex items-center gap-1 transition-all ${
              viewMode === "table"
                ? "bg-card text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </Button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <RefreshButton />

        <Link href="/restaurant-orders">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-medium gap-1.5 border-border/80 hover:bg-muted text-foreground/80 hover:text-foreground cursor-pointer"
          >
            <ChefHat className="w-3.5 h-3.5 text-primary" />
            <span className="hidden lg:inline">Kitchen Display</span>
          </Button>
        </Link>

        <Link href="/restaurants/add">
          <Button
            size="sm"
            className="h-9 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Venue</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
