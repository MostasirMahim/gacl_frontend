"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settings, ChefHat, ExternalLink, Clock, Users, MapPin } from "lucide-react";
import { getMediaUrl } from "@/lib/utils";

const FALLBACK_BANNERS = [
  "/assets/restaurent_images/banner/2.jpg",
  "/assets/restaurent_images/banner/9.jpg",
  "/assets/restaurent_images/banner/10.jpg",
  "/assets/restaurent_images/banner/11.jpg",
];

interface RestaurantEnterpriseTableProps {
  restaurants: any[];
}

export function RestaurantEnterpriseTable({ restaurants }: RestaurantEnterpriseTableProps) {
  if (restaurants.length === 0) {
    return (
      <div className="p-8 text-center bg-card border border-border/80 rounded-xl text-muted-foreground text-xs">
        No restaurants found matching your criteria.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <TableHead className="pl-4 py-3">Venue</TableHead>
              <TableHead className="py-3">Status</TableHead>
              <TableHead className="py-3">Cuisine</TableHead>
              <TableHead className="py-3">Operating Hours</TableHead>
              <TableHead className="py-3">Capacity</TableHead>
              <TableHead className="py-3">Booking Fee</TableHead>
              <TableHead className="py-3">Location</TableHead>
              <TableHead className="text-right pr-4 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60 text-xs">
            {restaurants.map((r, idx) => {
              const isOpen = r.status === "open";
              const bannerSrc = r.banner_bg_image
                ? getMediaUrl(r.banner_bg_image)
                : FALLBACK_BANNERS[idx % FALLBACK_BANNERS.length];
              const cuisine = r.cuisine_type?.name || "Continental";
              const type = r.restaurant_type?.name || "Dining";
              const capacity = Number(r.capacity) || 50;

              return (
                <TableRow
                  key={r.id}
                  className="hover:bg-muted/40 transition-colors group cursor-default"
                >
                  {/* Venue Name & Thumbnail */}
                  <TableCell className="pl-4 py-3">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border/80 bg-muted">
                        <img
                          src={bannerSrc}
                          alt={r.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/restaurants/${r.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {r.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground tracking-wide font-medium">
                          {type}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        isOpen
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/25"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        }`}
                      />
                      {isOpen ? "Open Now" : "Closed"}
                    </span>
                  </TableCell>

                  {/* Cuisine */}
                  <TableCell className="py-3 whitespace-nowrap">
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-md bg-muted font-medium text-foreground/85 border border-border/50">
                      {cuisine}
                    </span>
                  </TableCell>

                  {/* Hours */}
                  <TableCell className="py-3 whitespace-nowrap text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Clock className="w-3 h-3 text-primary/70 shrink-0" />
                      {r.opening_time && r.closing_time
                        ? `${r.opening_time.slice(0, 5)} – ${r.closing_time.slice(0, 5)}`
                        : `${r.operating_hours || 12} hrs`}
                    </span>
                  </TableCell>

                  {/* Capacity */}
                  <TableCell className="py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-foreground">{capacity}</span>
                      <div className="w-14 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary/70 h-full rounded-full"
                          style={{ width: `${Math.min(100, (capacity / 200) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Booking Fee */}
                  <TableCell className="py-3 whitespace-nowrap">
                    {r.booking_fees_per_seat ? (
                      <span className="font-mono font-medium text-foreground">
                        ৳{r.booking_fees_per_seat}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Free</span>
                    )}
                  </TableCell>

                  {/* Location */}
                  <TableCell className="py-3 whitespace-nowrap text-muted-foreground">
                    <span className="flex items-center gap-1 text-[11px] truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {r.city || r.address || "Main Campus"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-4 py-3 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link href={`/restaurants/${r.id}`}>
                        <Button
                          size="sm"
                          className="h-7 text-xs px-2.5 font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Manage
                        </Button>
                      </Link>

                      <Link href="/restaurant-orders">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Kitchen Orders"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                        </Button>
                      </Link>

                      {r.slug && (
                        <Link href={`/restaurant/${r.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Storefront Preview"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
