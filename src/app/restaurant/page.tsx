"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2,
  ArrowRight,
  MapPin,
  Clock,
  Search,
  User,
  UtensilsCrossed,
  Coffee,
  Utensils,
  Layers,
  Leaf,
  Heart,
  Star,
  ChevronDown,
  CornerDownLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import { BRAND_CONFIG } from "@/config/brand";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state: string;
  operating_hours: number;
  capacity: number;
  status: string;
  opening_time: string;
  closing_time: string;
  banner_bg_image: string | null;
  banner_title: string;
  banner_description: string;
  about_text: string;
  cuisine_type_name: string;
  restaurant_type_name: string;
  logo?: string | null;
  dp_image?: string | null;
  average_rating?: number | null;
  total_reviews?: number | null;
}

const CUISINE_CATEGORIES = [
  { label: "Fine Dining", icon: UtensilsCrossed },
  { label: "Cafes", icon: Coffee },
  { label: "Fast Food", icon: Utensils },
  { label: "Buffet", icon: Layers },
  { label: "Healthy", icon: Leaf },
];

const FALLBACK_RESTAURANT_IMAGES = [
  "/assets/restaurent_images/banner/11.jpg",
  "/assets/restaurent_images/banner/10.jpg",
  "/assets/restaurent_images/banner/2.jpg",
  "/assets/restaurent_images/banner/9.jpg",
];

const FALLBACK_RESTAURANT_LOGOS = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&auto=format&fit=crop&q=80",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// Seeded ratings
function getSeededRating(id: number) {
  const base = ((id * 9301 + 49297) % 233280) / 233280;
  return (4.3 + base * 0.6).toFixed(1);
}
function getSeededCount(id: number) {
  const base = ((id * 1103 + 7919) % 233280) / 233280;
  return Math.floor(400 + base * 900);
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k+`;
  return `${n}+`;
}

export default function RestaurantLandingPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState("Dhaka");
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("polluted_css_from_slug")) {
      sessionStorage.removeItem("polluted_css_from_slug");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/api/restaurants/v1/public/restaurants/");
        const data = res.data?.data || res.data?.results || res.data;
        setRestaurants(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.cuisine_type_name && r.cuisine_type_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.city && r.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d0d0d]">
        <Loader2 className="h-10 w-10 animate-spin text-[#d4a43d]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d0d0d]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Oops!</h2>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f3ef] font-sans overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0d0d0d]/95 backdrop-blur-md shadow-lg py-3"
            : "bg-gradient-to-b from-[#0d0d0d]/90 to-transparent py-4"
        }`}
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden  flex items-center justify-center">
              <Image
                src={BRAND_CONFIG.logoUrl}
                alt="Saint Club"
                width={36}
                height={36}
                className="object-contain scale-90"
              />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide leading-tight">Saint Club</p>
              <p className="text-white/50 text-[10px] leading-tight">Good Food • Great Moments</p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/restaurant" className="relative text-white font-semibold group py-1">
              <span>Home</span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a43d] rounded-full" />
            </Link>
            <Link href="/restaurant" className="text-white/70 hover:text-white transition-colors py-1">
              Restaurants
            </Link>
            <Link href="#offers" className="text-white/70 hover:text-white transition-colors py-1">
              Offers
            </Link>
            <Link href="#about" className="text-white/70 hover:text-white transition-colors py-1">
              About
            </Link>
          </nav>

          {/* Center Search (desktop) */}
          <div className="flex-1 max-w-md hidden md:block relative">
            <div className="relative flex items-center h-10">
              <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or areas..."
                className="w-full pl-10 pr-9 py-2 rounded-full text-xs bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-[#d4a43d]/60 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              <CornerDownLeft className="absolute right-3.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>

            {/* Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto z-50">
                {filteredRestaurants.length > 0 ? (
                  <ul className="py-2">
                    {filteredRestaurants.map((r, idx) => (
                      <li key={r.id}>
                        <Link
                          href={`/restaurant/${r.slug || r.id}/menu`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden relative shrink-0">
                            <Image
                              src={r.banner_bg_image ? getMediaUrl(r.banner_bg_image) : FALLBACK_RESTAURANT_IMAGES[idx % FALLBACK_RESTAURANT_IMAGES.length]}
                              alt={r.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white truncate">{r.name}</p>
                            <p className="text-xs text-zinc-400 truncate">{r.cuisine_type_name} • {r.city || "Dhaka"}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500 text-sm text-center p-6">No restaurants match "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>

          {/* Right Area: Location + Login */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Location selector */}
            <div className="relative">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-1.5 text-white/90 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors text-xs font-medium cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#d4a43d]" />
                <span>{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
              {showLocationMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-xl py-1 z-50">
                  {["Dhaka", "Chittagong", "Sylhet", "Gulshan", "Banani"].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login button */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-[#d4a43d] hover:bg-[#c4932e] text-[#0d0d0d] font-bold text-xs px-4 py-2 rounded-full transition-all duration-200 shadow-md shadow-[#d4a43d]/20 shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[72vh] lg:min-h-[78vh] flex items-stretch overflow-hidden bg-[#0d0d0d]">
        {/* Background image: resturant_slides.png */}
        <div className="absolute inset-0">
          <Image
            src="/assets/resturant_slides.png"
            alt="Discover Culinary Excellence"
            fill
            priority
            className="object-cover object-right"
          />
          {/* Left shadow gradient so text is crisp, right side is FULLY clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 via-42% to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/30 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-[#d4a43d]" />
              <span className="text-[#d4a43d] text-[11px] font-bold tracking-[0.2em] uppercase">
                Discover • Dine • Enjoy
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.08] mb-4 tracking-tight">
              Discover Culinary{" "}
              <span className="text-[#d4a43d] font-serif italic">Excellence</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-zinc-300 leading-relaxed max-w-md mb-6">
              Explore our curated selection of premium restaurants,
              each offering a unique atmosphere and unforgettable flavors.
            </p>

            {/* Hero Search Bar */}
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-2xl max-w-[490px] ">
              <div className="flex items-center flex-1 px-4 gap-2">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or areas..."
                  className="flex-1 py-3 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1.5 px-3 border-l border-zinc-200 text-xs sm:text-sm text-zinc-600 cursor-pointer hover:text-zinc-900 transition-colors shrink-0 self-stretch">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-medium">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </div>
              <button className="bg-[#d4a43d] hover:bg-[#c4932e] text-[#0d0d0d] font-bold text-xs sm:text-sm px-5 py-3 flex items-center gap-1.5 transition-all duration-200 shrink-0 self-stretch cursor-pointer">
                Search <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-4 sm:gap-5 mt-6 flex-wrap">
              {CUISINE_CATEGORIES.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full border border-white/20 bg-white/10 group-hover:bg-white/20 group-hover:border-white/40 flex items-center justify-center transition-colors duration-200">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-white/70 group-hover:text-white transition-colors">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom smooth wave transition into the white background */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 70" className="w-full text-[#f5f3ef] fill-current" preserveAspectRatio="none" style={{ height: "55px" }}>
            <path d="M0,35 C320,65 720,5 1100,50 C1260,68 1380,45 1440,35 L1440,70 L0,70 Z" />
          </svg>
        </div>
      </section>

      {/* ── RESTAURANTS SECTION ── */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-px bg-[#d4a43d]" />
              <span className="text-[#d4a43d] text-[10px] font-bold tracking-[0.16em] uppercase">Top Picks For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight">
              Popular Restaurants{" "}
              <span className="text-[#d4a43d] font-serif">Near You</span>
            </h2>
            <p className="text-zinc-500 text-xs mt-1">Handpicked by food lovers, rated highly, and loved by many.</p>
          </div>
          <Link
            href="/restaurant"
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-[#d4a43d] transition-colors shrink-0"
          >
            View All Restaurants <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-zinc-100">
            <UtensilsCrossed className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-zinc-700 mb-1">No venues available right now</h3>
            <p className="text-zinc-400 text-sm">Please check back later or adjust your search.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredRestaurants.map((r, idx) => {
              const hasReviews = typeof r.total_reviews === "number" && r.total_reviews > 0;
              const rating = hasReviews && r.average_rating != null
                ? Number(r.average_rating).toFixed(1)
                : getSeededRating(r.id);
              const countDisplay = hasReviews
                ? `(${r.total_reviews})`
                : `(${formatCount(getSeededCount(r.id))})`;
              const isFav = favorites.has(r.id);
              const fallbackImg = FALLBACK_RESTAURANT_IMAGES[idx % FALLBACK_RESTAURANT_IMAGES.length];
              const imgSrc = r.banner_bg_image ? getMediaUrl(r.banner_bg_image) : fallbackImg;
              const fallbackLogo = FALLBACK_RESTAURANT_LOGOS[idx % FALLBACK_RESTAURANT_LOGOS.length];
              const logoSrc = (r.dp_image || r.logo) ? getMediaUrl(r.dp_image || r.logo) : fallbackLogo;

              // Build feature tags from type/cuisine
              const tags = [
                r.restaurant_type_name || "Fine Dining",
                r.cuisine_type_name || "Multicuisine",
                "Outdoor Seating",
              ].filter(Boolean).slice(0, 3);

              return (
                <motion.div key={r.id} variants={cardVariants} className="h-full">
                  <Link
                    href={`/restaurant/${r.slug || r.id}/menu`}
                    className="block h-full outline-none"
                  >
                    <div className="group relative h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 border border-zinc-100">
                      {/* Top Image */}
                      <div className="relative h-44 overflow-hidden bg-zinc-900 shrink-0">
                        <Image
                          src={imgSrc}
                          alt={r.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            // Fallback to local stock image if media URL fails
                            (e.target as HTMLImageElement).src = fallbackImg;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                        {/* Cuisine badge top-left: sleek black pill with amber border & gold text */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#d4a43d] border border-[#d4a43d]/70 rounded-full shadow-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a43d]" />
                            {r.cuisine_type_name || "Fine Dining"}
                          </span>
                        </div>

                        {/* Favorite Heart top-right */}
                        <button
                          onClick={(e) => toggleFavorite(e, r.id)}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-200 cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFav ? "fill-rose-500 text-rose-500" : "text-white hover:text-rose-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="pt-2 px-4 pb-4 flex-1 flex flex-col bg-white">
                        {/* Avatar & Title Row: Avatar on left, Title & Rating on right */}
                        <div className="flex items-start gap-3 -mt-6 mb-3">
                          {/* Round dark logo badge */}
                          <div className="relative w-12 h-12 rounded-full bg-[#111111] border-2 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0 z-20">
                            <Image
                              src={logoSrc}
                              alt={r.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = fallbackLogo;
                              }}
                            />
                          </div>

                          {/* Title & Star Rating */}
                          <div className="flex-1 min-w-0 pt-4">
                            <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#d4a43d] transition-colors truncate leading-tight">
                              {r.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Star className="w-3.5 h-3.5 fill-[#d4a43d] text-[#d4a43d]" />
                              <span className="text-xs font-bold text-zinc-800">{rating}</span>
                              <span className="text-xs text-zinc-400">{countDisplay}</span>
                            </div>
                          </div>
                        </div>

                        {/* Info Rows */}
                        <div className="space-y-1.5 mb-3 text-xs text-zinc-500">
                          {/* Cuisine / Style */}
                          <div className="flex items-center gap-2">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate">
                              {[r.cuisine_type_name, r.restaurant_type_name].filter(Boolean).join(", ") || "Continental, Italian, European"}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate">
                              {r.address ? `${r.address}${r.city ? `, ${r.city}` : ""}` : (r.city || "17th Floor, Office 375, Befin, Dhaka")}
                            </span>
                          </div>

                          {/* Hours */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>
                              {r.opening_time ? r.opening_time.slice(0, 5) : "08:30"} - {r.closing_time ? r.closing_time.slice(0, 5) : "22:00"}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Tags & Circular Action Button */}
                        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                          {/* Warm cream/beige pills */}
                          <div className="flex flex-wrap gap-1.5 overflow-hidden">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 text-[10px] font-medium text-[#9E6E2E] bg-[#FAF5ED] rounded-md transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Black round arrow button */}
                          <div className="w-8 h-8 rounded-full bg-[#111111] group-hover:bg-[#d4a43d] flex items-center justify-center transition-colors duration-200 shrink-0 shadow-sm">
                            <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#111111] transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Mobile view all */}
        <div className="sm:hidden text-center mt-6">
          <Link
            href="/restaurant"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 border border-zinc-300 px-5 py-2.5 rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
          >
            View All Restaurants <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── COMPACT FOOTER WAVE SECTION ── */}
      {/* Uses negative margin to remove the dead white gap from the top of the image */}
      <section className="relative overflow-hidden pointer-events-none select-none">
        <div className="relative w-full h-[150px] sm:h-[180px] md:h-[220px]">
          <Image
            src="/assets/resturent_hero.png"
            alt="More Than Just Food - IT'S AN EXPERIENCE"
            fill
            className="object-cover object-bottom"
            priority={false}
          />
        </div>
      </section>
    </main>
  );
}

