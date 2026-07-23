"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, ArrowRight, MapPin, Clock, Search, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function RestaurantLandingPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New states for Header
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    // If we came from a page that uses Bootstrap or other heavy global CSS,
    // force a hard reload to clean the DOM and restore our Tailwind design.
    if (typeof window !== "undefined" && sessionStorage.getItem("polluted_css_from_slug")) {
      sessionStorage.removeItem("polluted_css_from_slug");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/restaurants/v1/public/restaurants/",
        );
        const data =
          response.data?.data || response.data?.results || response.data;
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 font-sans">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-transparent dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Side: Brand Logo */}
          <div className="flex items-center mr-4">
            <Link
              href="/"
              className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform shrink-0"
            >
              <Image
                src="/assets/logo.png"
                alt="Brand Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Right Side: Search Input & Login Button */}
          <div className="flex items-center gap-2 sm:gap-6 h-10 w-full sm:w-auto flex-row justify-end flex-1 sm:flex-none">
            {/* Search Input with Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <div className="relative flex items-center h-10">
                <Search
                  className={`absolute left-3 h-4 w-4 z-10 ${isScrolled ? "text-slate-400" : "text-slate-500"}`}
                />
                <Input
                  placeholder="Search restaurants..."
                  className={`pl-9 w-full sm:w-[250px] md:w-[350px] rounded-full transition-all border-1 border-slate-600 focus-visible:ring-2 ${
                    isScrolled
                      ? "bg-slate-200 dark:bg-slate-800/70 focus-visible:ring-primary/50 text-slate-900 dark:text-white"
                      : "bg-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/50"
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                />
              </div>

              {/* Search Dropdown */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[280px] sm:w-[350px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[350px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {filteredRestaurants.length > 0 ? (
                    <ul className="py-2">
                      {filteredRestaurants.map((r) => (
                        <li key={r.id}>
                          <Link
                            href={`/restaurant/${r.slug || r.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden relative flex-shrink-0">
                              {r.banner_bg_image ? (
                                <Image
                                  src={getMediaUrl(r.banner_bg_image)}
                                  alt={r.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {r.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {r.cuisine_type_name || "Restaurant"} •{" "}
                                {r.city || "Various Locations"}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-sm text-slate-500 dark:text-slate-400 text-center flex flex-col items-center">
                      <Search className="w-8 h-8 text-slate-300 mb-2" />
                      <p>No restaurants match "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stunning Login Button */}
            <Button
              asChild
              variant={isScrolled ? "default" : "secondary"}
              className={`rounded-full h-10 shadow-lg font-semibold px-4 sm:px-6 transition-all duration-300 shrink-0 ${
                !isScrolled &&
                "bg-white/20 hover:bg-white/30 text-white border-0"
              }`}
            >
              <Link href="/login">
                <User className="h-4 w-4 hidden sm:inline-block" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/80 to-black z-0">
          <div className="absolute inset-0 opacity-50 bg-[url('/assets/restaurant_cover.jpg')] bg-cover bg-center"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg"
          >
            Discover Culinary <span className="text-blue-400">Excellence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-blue-100 font-medium max-w-3xl mx-auto drop-shadow-md leading-relaxed"
          >
            Explore our curated selection of premium venues, each offering a
            unique atmosphere and unforgettable flavors.
          </motion.p>
        </div>

        {/* Decorative Wave/Fade at bottom */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-900 dark:from-slate-900 to-transparent z-10"></div>
      </section>

      {/* Grid Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {restaurants.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center shadow-lg border border-blue-100 dark:border-slate-700">
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">
              No venues available right now
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Please check back later as we open new experiences.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                variants={itemVariants}
                className="h-full"
              >
                <Link
                  href={`/restaurant/${restaurant.slug || restaurant.id}`}
                  className="block h-full outline-none focus:ring-2 focus:ring-primary rounded-2xl"
                >
                  <div className="group relative h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(59,130,246,0.06)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] dark:shadow-none transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-blue-50/50 dark:bg-slate-700">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                      {restaurant.banner_bg_image ? (
                        <Image
                          src={getMediaUrl(restaurant.banner_bg_image)}
                          alt={restaurant.name}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-transparent flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700 ease-out">
                          <span className="text-blue-300 dark:text-slate-500 text-sm font-medium">
                            No Image
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
                        {restaurant.cuisine_type_name && (
                          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-700 dark:text-slate-200 rounded-md shadow-sm">
                            {restaurant.cuisine_type_name}
                          </span>
                        )}
                        {restaurant.restaurant_type_name && (
                          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-primary/95 backdrop-blur-sm text-white rounded-md shadow-sm">
                            {restaurant.restaurant_type_name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-5 flex-1 flex flex-col relative bg-white dark:bg-slate-800">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                        {restaurant.name}
                      </h3>

                      <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2 flex-1 leading-relaxed">
                        {restaurant.description ||
                          restaurant.about_text ||
                          "Experience an unforgettable dining journey tailored to your taste."}
                      </p>

                      <div className="space-y-2 mb-4">
                        {restaurant.city && (
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                            <span className="truncate">
                              {restaurant.address
                                ? `${restaurant.address}, `
                                : ""}
                              {restaurant.city}
                            </span>
                          </div>
                        )}
                        {(restaurant.opening_time ||
                          restaurant.closing_time) && (
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                            <span>
                              {restaurant.opening_time
                                ? restaurant.opening_time.slice(0, 5)
                                : ""}
                              {restaurant.opening_time &&
                              restaurant.closing_time
                                ? " - "
                                : ""}
                              {restaurant.closing_time
                                ? restaurant.closing_time.slice(0, 5)
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between mt-auto">
                        <span className="text-sm font-semibold text-primary transition-colors">
                          Explore Menu
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}
