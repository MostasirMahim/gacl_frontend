"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemberSelectModal from "@/components/shared/MemberSelectModal";
import { getMediaUrl, cn } from "@/lib/utils";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ChefHat,
  Flame,
  UtensilsCrossed,
  DoorOpen,
  User,
  ShoppingBag,
  Sparkles,
  Receipt,
  X,
  Store,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function useRestaurants() {
  return useQuery({
    queryKey: ["orderCreateRestaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/api/restaurants/v1/restaurants/?page_size=100"
      );
      return res?.data;
    },
  });
}

function useRestaurantItems(restaurantId?: number) {
  return useQuery({
    queryKey: ["orderCreateItems", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/restaurants/v1/restaurants/items/?restaurant=${restaurantId}&page_size=200`
      );
      return res?.data;
    },
  });
}

function useSpicyLevels() {
  return useQuery({
    queryKey: ["spicyLevels"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/api/restaurants/v1/restaurants/spicy-levels/"
      );
      return res?.data;
    },
  });
}

function useRestaurantCategories(restaurantId?: number) {
  return useQuery({
    queryKey: ["orderCreateCategories", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/restaurants/v1/restaurants/items/categories/?restaurant=${restaurantId}&all=true`
      );
      return res?.data?.data || [];
    },
  });
}

function getItemCategory(it: any): string {
  if (typeof it?.category === "string" && it.category.trim()) {
    return it.category.trim();
  }
  if (typeof it?.category?.name === "string" && it.category.name.trim()) {
    return it.category.name.trim();
  }
  if (typeof it?.category_title === "string" && it.category_title.trim()) {
    return it.category_title.trim();
  }
  if (typeof it?.category_name === "string" && it.category_name.trim()) {
    return it.category_name.trim();
  }
  if (typeof it?.menu_section_title === "string" && it.menu_section_title.trim()) {
    return it.menu_section_title.trim();
  }
  return "General";
}

interface CartItem {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  spicy_level_id: number | null;
  spicy_label: string;
  image?: string;
  category?: string;
}

export default function RestaurantOrderCreate() {
  const queryClient = useQueryClient();
  const { data: restData, isLoading: loadingRestaurants } = useRestaurants();
  const restaurants = restData?.data || [];

  const [restaurantId, setRestaurantId] = useState<number | undefined>(undefined);

  // Set default restaurant once loaded
  useEffect(() => {
    if (!restaurantId && restaurants.length > 0) {
      setRestaurantId(restaurants[0].id);
    }
  }, [restaurants, restaurantId]);

  const { data: itemsData, isLoading: loadingItems } =
    useRestaurantItems(restaurantId);
  const items = itemsData?.data || [];

  const { data: apiCategories = [] } = useRestaurantCategories(restaurantId);

  const { data: spicyData } = useSpicyLevels();
  const spicyLevels = spicyData?.data || [];

  // Order Details
  const [member, setMember] = useState<any>(null);
  const [placedBy, setPlacedBy] = useState("waiter");
  const [serveLocation, setServeLocation] = useState<"restaurant" | "room">(
    "restaurant"
  );
  const [roomNumber, setRoomNumber] = useState("");
  const [note, setNote] = useState("");
  const [requireOtp, setRequireOtp] = useState(false);

  // POS Menu Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Reset category filter when restaurant changes
  useEffect(() => {
    setSelectedCategory("ALL");
  }, [restaurantId]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Categories extraction with counts
  const categoriesWithCounts = useMemo(() => {
    const map = new Map<string, number>();

    // Register categories from API for this restaurant
    if (Array.isArray(apiCategories)) {
      apiCategories.forEach((cat: any) => {
        const name = typeof cat === "string" ? cat : cat?.name;
        if (name && name.trim()) map.set(name.trim(), 0);
      });
    }

    // Count items per category from loaded items
    items.forEach((it: any) => {
      const c = getItemCategory(it);
      map.set(c, (map.get(c) || 0) + 1);
    });

    return Array.from(map.entries())
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }));
  }, [items, apiCategories]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((it: any) => {
      const matchesSearch = searchQuery
        ? it.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (it.description &&
            it.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      const c = getItemCategory(it);
      const matchesCategory =
        selectedCategory === "ALL" || c === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const currentRestaurant = useMemo(() => {
    return restaurants.find((r: any) => r.id === restaurantId);
  }, [restaurants, restaurantId]);

  // Add Item to Cart
  function addToCart(item: any) {
    const price = Number(item.selling_price ?? item.price ?? 0);
    const itemImage = item.cover_image
      ? getMediaUrl(item.cover_image)
      : `/assets/restaurent_images/food/${((item.id || 1) % 20) + 1}.jpg`;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.item_id === item.id && c.spicy_level_id === null
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          item_id: item.id,
          name: item.name,
          price,
          quantity: 1,
          spicy_level_id: null,
          spicy_label: "",
          image: itemImage,
          category: getItemCategory(item),
        },
      ];
    });
  }

  // Stepper quantity update
  function updateQty(idx: number, delta: number) {
    setCart((prev) => {
      const copy = [...prev];
      const newQty = copy[idx].quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== idx);
      }
      copy[idx].quantity = newQty;
      return copy;
    });
  }

  // Change spicy level
  function updateSpicy(idx: number, spicyIdStr: string) {
    const spicy = spicyLevels.find((s: any) => String(s.id) === spicyIdStr);
    setCart((prev) => {
      const copy = [...prev];
      copy[idx].spicy_level_id = spicy ? spicy.id : null;
      copy[idx].spicy_label = spicy ? spicy.name : "";
      return copy;
    });
  }

  function removeFromCart(idx: number) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  function clearCart() {
    setCart([]);
  }

  // Cost calculations
  const totalItemsCount = cart.reduce((sum, x) => sum + x.quantity, 0);
  const total = cart.reduce(
    (sum, x) => sum + Number(x.price || 0) * x.quantity,
    0
  );

  async function placeOrder() {
    if (!restaurantId) return toast.error("Please select a restaurant venue");
    if (!member) return toast.error("Please select a member for this order");
    if (cart.length === 0)
      return toast.error("Cart is empty. Tap items to add them to ticket");
    if (serveLocation === "room" && !roomNumber.trim()) {
      return toast.error("Please enter room number for room service");
    }

    setLoading(true);
    try {
      const payload = {
        restaurant_id: restaurantId,
        member_id: member.id,
        placed_by: placedBy,
        serve_location: serveLocation,
        room_number: serveLocation === "room" ? roomNumber : "",
        note,
        require_otp: requireOtp,
        items: cart.map((x) => ({
          item_id: x.item_id,
          quantity: x.quantity,
          spicy_level_id: x.spicy_level_id,
        })),
      };

      await axiosInstance.post(
        "/api/restaurants/v1/restaurants/orders/",
        payload
      );
      toast.success(
        requireOtp
          ? "Order created — Member OTP confirmation sent"
          : "Order created successfully & dispatched to Kitchen KDS!"
      );
      setCart([]);
      setMember(null);
      setRoomNumber("");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["getRestaurantOrders"] });
      queryClient.invalidateQueries({ queryKey: ["kitchenOrders"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Top POS Toolbar: Venue Selector & Service Mode */}
      <div className="bg-card rounded-2xl border border-border/60 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Venue Selector */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground block">
                Active Restaurant Venue
              </label>
              <Select
                value={restaurantId ? String(restaurantId) : ""}
                onValueChange={(v) => {
                  setRestaurantId(Number(v));
                  setCart([]);
                }}
              >
                <SelectTrigger className="h-8 font-semibold text-xs border-border/60 bg-muted/30 min-w-[200px]">
                  <SelectValue placeholder="Select restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((r: any) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Dining Mode Segment */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-muted/60 rounded-xl border border-border/50">
              <button
                type="button"
                onClick={() => setServeLocation("restaurant")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  serveLocation === "restaurant"
                    ? "bg-card text-foreground shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
                Dine-In
              </button>
              <button
                type="button"
                onClick={() => setServeLocation("room")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  serveLocation === "room"
                    ? "bg-card text-foreground shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5 text-blue-500" />
                Room Service
              </button>
            </div>

            {serveLocation === "room" && (
              <Input
                placeholder="Room # (e.g. 402)"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-32 h-8 text-xs font-mono border-blue-500/50 bg-blue-500/5"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Dual-Pane POS Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Visual Menu Browser */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Search & Category Filter Pills */}
          <div className="space-y-3 bg-card rounded-2xl border border-border/60 p-4 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food items by name, cuisine, ingredients..."
                className="pl-9 h-9 text-xs bg-muted/30 border-border/60 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Horizontal Category Carousel - One line scrollable X */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar sm:no-scrollbar whitespace-nowrap scroll-smooth">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5",
                  selectedCategory === "ALL"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                )}
              >
                <span>All Items</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium",
                    selectedCategory === "ALL"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-card text-muted-foreground border border-border/50"
                  )}
                >
                  {items.length}
                </span>
              </button>
              {categoriesWithCounts.map(({ name, count }) => {
                const active = selectedCategory === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedCategory(name)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5",
                      active
                        ? "bg-primary text-primary-foreground shadow-xs font-bold"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                    )}
                  >
                    <span>{name}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-card text-muted-foreground border border-border/50"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Items Visual Grid */}
          {loadingItems ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl bg-card border border-border/40 animate-pulse p-3 space-y-2"
                >
                  <div className="h-24 rounded-xl bg-muted/60" />
                  <div className="h-3 w-3/4 bg-muted/60 rounded" />
                  <div className="h-3 w-1/2 bg-muted/40 rounded" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border/60 p-6 space-y-2">
              <UtensilsCrossed className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <h4 className="text-sm font-semibold text-foreground">
                No menu items found
              </h4>
              <p className="text-xs text-muted-foreground">
                {searchQuery
                  ? `No dishes matching "${searchQuery}" in this category.`
                  : "No items registered for this venue."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredItems.map((item: any) => {
                const itemPrice = Number(
                  item.selling_price ?? item.price ?? 0
                );
                const itemImage = item.cover_image
                  ? getMediaUrl(item.cover_image)
                  : `/assets/restaurent_images/food/${
                      ((item.id || 1) % 20) + 1
                    }.jpg`;
                const inCart = cart.find((c) => c.item_id === item.id);

                return (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(item)}
                    className={`group cursor-pointer select-none relative overflow-hidden rounded-2xl border transition-all duration-200 bg-card hover:border-primary/50 hover:shadow-md flex flex-col justify-between ${
                      inCart
                        ? "border-primary/50 ring-1 ring-primary/30"
                        : "border-border/60"
                    }`}
                  >
                    {/* Item Image */}
                    <div className="relative h-28 w-full overflow-hidden bg-muted">
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* In-cart count badge */}
                      {inCart && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground font-mono font-bold text-xs px-2 py-0.5 rounded-full shadow-md">
                          {inCart.quantity} in ticket
                        </div>
                      )}

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-2 left-2">
                        <span className="font-mono font-bold text-xs text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                          ৳{itemPrice.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {getItemCategory(item)}
                        </p>
                      </div>

                      {/* Tap to add button */}
                      <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {item.stock !== undefined
                            ? `Stock: ${item.stock}`
                            : "Available"}
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Active Digital Order Slip */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-4 space-y-4">
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            {/* Ticket Header */}
            <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  Order Ticket #{restaurantId || 1}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">
                  {totalItemsCount} items
                </Badge>
                {cart.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearCart}
                    className="h-6 px-1.5 text-[11px] text-red-500 hover:text-red-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Member Card / Lookup */}
            <div className="p-4 border-b border-border/50 space-y-2.5 bg-card">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Member Account
                </label>
                {member && (
                  <Badge variant="secondary" className="text-[10px] font-mono font-bold text-primary">
                    {member.member_ID}
                  </Badge>
                )}
              </div>
              <MemberSelectModal
                value={
                  member
                    ? {
                        member_ID: member.member_ID,
                        name: member.name,
                        email: member.email,
                        phone: member.phone || member.contact_number,
                        membership_type: member.membership_type,
                        membership_status: member.membership_status,
                      }
                    : null
                }
                onSelect={(m) => setMember(m)}
                onClear={() => setMember(null)}
              />
              {member && (
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground truncate">{member.name}</span>
                    {member.membership_status && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize shrink-0">
                        {member.membership_status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                    {(member.phone || member.contact_number) && (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-muted-foreground/70" />
                        {member.phone || member.contact_number}
                      </span>
                    )}
                    {member.email && (
                      <span className="inline-flex items-center gap-1 truncate max-w-[190px]">
                        <Mail className="w-3 h-3 text-muted-foreground/70" />
                        <span className="truncate">{member.email}</span>
                      </span>
                    )}
                    {member.membership_type && (
                      <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-card border border-border/70">
                        {member.membership_type}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Line Items */}
            <div className="p-4 flex-1 max-h-[360px] overflow-y-auto space-y-3 divide-y divide-border/40">
              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Order slip is empty
                  </p>
                  <p className="text-[11px] text-muted-foreground/80">
                    Tap dishes from the menu to add to this ticket
                  </p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.item_id}-${idx}`} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border/50"
                        />
                        <div>
                          <h5 className="text-xs font-semibold text-foreground line-clamp-1">
                            {item.name}
                          </h5>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            ৳{Number(item.price).toFixed(0)} × {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Item Total */}
                      <span className="font-mono font-bold text-xs text-foreground shrink-0">
                        ৳{(Number(item.price) * item.quantity).toFixed(0)}
                      </span>
                    </div>

                    {/* Stepper + Spicy selector + Trash */}
                    <div className="flex items-center justify-between gap-2 pl-12">
                      {/* Spicy level select if available */}
                      {spicyLevels.length > 0 && (
                        <Select
                          value={
                            item.spicy_level_id
                              ? String(item.spicy_level_id)
                              : "none"
                          }
                          onValueChange={(v) =>
                            updateSpicy(idx, v === "none" ? "" : v)
                          }
                        >
                          <SelectTrigger className="h-6 text-[10px] w-24 border-border/50 bg-muted/30 px-1.5">
                            <SelectValue placeholder="Spicy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Mild / Regular</SelectItem>
                            {spicyLevels.map((s: any) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQty(idx, -1)}
                          className="h-6 w-6 p-0 rounded-md"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-mono text-xs font-bold w-5 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQty(idx, 1)}
                          className="h-6 w-6 p-0 rounded-md"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(idx)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Note & Options */}
            <div className="p-4 border-t border-border/50 bg-muted/20 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Kitchen Prep Notes
                </label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Less salt, extra lime, serve starters first..."
                  className="h-8 text-xs bg-card border-border/60"
                />
              </div>

              {/* Service & Staff options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={requireOtp}
                    onCheckedChange={setRequireOtp}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Require Member OTP
                  </span>
                </div>
                <Select value={placedBy} onValueChange={setPlacedBy}>
                  <SelectTrigger className="h-6 text-[10px] w-28 border-border/50 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiter">Waiter Order</SelectItem>
                    <SelectItem value="member">Member Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cost Summary Box */}
              <div className="bg-card rounded-xl border border-border/50 p-3 space-y-1.5 mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-mono">৳{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Service & VAT</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Applied at billing
                  </span>
                </div>
                <div className="border-t border-border/40 pt-1.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Grand Total
                  </span>
                  <span className="text-base font-extrabold font-mono text-primary">
                    ৳{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit to Kitchen Action */}
              <Button
                onClick={placeOrder}
                disabled={loading || cart.length === 0 || !member}
                className="w-full h-11 text-sm font-bold shadow-md gap-2"
              >
                {loading ? (
                  "Sending to Kitchen..."
                ) : (
                  <>
                    <ChefHat className="w-4 h-4 text-amber-300" />
                    Send Order to Kitchen (KOT)
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
