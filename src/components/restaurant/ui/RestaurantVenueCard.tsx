"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, MapPin, ChefHat, ArrowUpRight, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMediaUrl } from "@/lib/utils";

const FALLBACK_BANNERS = [
  "/assets/restaurent_images/banner/2.jpg",
  "/assets/restaurent_images/banner/9.jpg",
  "/assets/restaurent_images/banner/10.jpg",
  "/assets/restaurent_images/banner/11.jpg",
  "/assets/restaurant_cover.jpg",
];

interface RestaurantVenueCardProps {
  restaurant: any;
  delay?: number;
}

export function RestaurantVenueCard({ restaurant, delay = 0 }: RestaurantVenueCardProps) {
  const isOpen = restaurant.status === "open";
  const bannerSrc = restaurant.banner_bg_image
    ? getMediaUrl(restaurant.banner_bg_image)
    : FALLBACK_BANNERS[(restaurant.id || 0) % FALLBACK_BANNERS.length];

  const cuisineName = restaurant.cuisine_type?.name || "Continental";
  const typeName = restaurant.restaurant_type?.name || "Fine Dining";
  const capacity = Number(restaurant.capacity) || 50;
  const restaurantSlug =
    restaurant.slug ||
    restaurant.name
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    "menu";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
    >
      {/* Cover Banner Area */}
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        <img
          src={bannerSrc}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Ambient Top & Bottom Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges: Cuisine on Left & Menu Navigation on Right */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white/95 border border-white/20 backdrop-blur-md shadow-xs">
            {cuisineName}
          </span>

          <Link
            href={`/restaurant/${restaurantSlug}/menu`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open restaurant menu in new tab"
            aria-label="Open restaurant menu in new tab"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer group/nav"
          >
            <ExternalLink className="w-3.5 h-3.5 group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bottom Banner Title & Category */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10">
          <p className="text-[11px] text-white/80 font-medium tracking-wide uppercase">
            {typeName}
          </p>
          <h3 className="text-base font-bold text-white tracking-tight truncate drop-shadow-sm group-hover:text-primary-200 transition-colors">
            {restaurant.name}
          </h3>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Info Grid */}
        <div className="space-y-2.5 text-xs">
          {/* Operating Hours */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              Hours:
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
                title={isOpen ? "Open Now" : "Closed"}
              />
              {restaurant.opening_time && restaurant.closing_time
                ? `${restaurant.opening_time.slice(0, 5)} – ${restaurant.closing_time.slice(0, 5)}`
                : `${restaurant.operating_hours || 12} hrs / day`}
            </span>
          </div>

          {/* Seating Capacity with Progress bar */}
          <div>
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                Capacity:
              </span>
              <span className="font-semibold text-foreground">{capacity} Seats</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary/70 h-full rounded-full"
                style={{ width: `${Math.min(100, (capacity / 200) * 100)}%` }}
              />
            </div>
          </div>

          {/* Booking fee & City location */}
          <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/50">
            <span className="flex items-center gap-1 text-[11px] truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              {restaurant.city || restaurant.address || "Saint Club Campus"}
            </span>
            {restaurant.booking_fees_per_seat ? (
              <span className="text-[11px] font-mono font-medium text-foreground">
                ৳{restaurant.booking_fees_per_seat} / seat
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">No booking fee</span>
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="pt-2 border-t border-border/60 flex items-center gap-2">
          <Link href={`/restaurants/${restaurant.id}`} className="flex-1">
            <Button
              size="sm"
              className="w-full h-8 text-xs font-semibold gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage Hub
            </Button>
          </Link>

          <Link href="/restaurant-orders">
            <Button
              variant="outline"
              size="sm"
              title="Kitchen Display Orders"
              aria-label="Kitchen Display Orders"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/80 hover:bg-accent cursor-pointer"
            >
              <ChefHat className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
