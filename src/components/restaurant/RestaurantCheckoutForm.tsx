"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import MemberSelectModal from "@/components/shared/MemberSelectModal";
import { useRestaurantCartStore } from "@/store/restaurantStore";
import {
  Receipt,
  Store,
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  Mail,
  Percent,
  CheckCircle2,
  Printer,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  memberData?: any;
  promoCodeData?: any;
}

export default function RestaurantCheckoutForm({ memberData, promoCodeData }: Props) {
  // Store bindings
  const cart = useRestaurantCartStore((state) => state.cart || []);
  const restaurant = useRestaurantCartStore((state) => state.restaurant);
  const setRestaurant = useRestaurantCartStore((state) => state.setRestaurant);
  const addItem = useRestaurantCartStore((state) => state.addItem);
  const removeItem = useRestaurantCartStore((state) => state.removeItem);
  const updateQuantity = useRestaurantCartStore((state) => state.updateQuantity);
  const clearCart = useRestaurantCartStore((state) => state.clearCart);

  // Local state
  const [mounted, setMounted] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [itemSearch, setItemSearch] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<any>(null);
  const [invoiceSnapshot, setInvoiceSnapshot] = useState<{
    items: any[];
    member: any;
    venueName: string;
    subtotal: number;
    discount: number;
    finalTotal: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Venues
  const { data: venuesData, isLoading: isLoadingVenues } = useQuery({
    queryKey: ["checkoutVenuesList"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/restaurants/v1/restaurants/?page_size=100");
      return res?.data?.data || [];
    },
  });

  const venues: any[] = Array.isArray(venuesData) ? venuesData : [];

  // Auto-set venue if not set
  useEffect(() => {
    if (mounted && venues.length > 0) {
      if (!restaurant || !venues.some((v) => v.id === Number(restaurant))) {
        setRestaurant(venues[0].id);
      }
    }
  }, [mounted, venues, restaurant, setRestaurant]);

  const currentVenue = useMemo(() => {
    return venues.find((v) => v.id === Number(restaurant)) || null;
  }, [venues, restaurant]);

  // Fetch items for selected venue
  const { data: itemsData, isLoading: isLoadingItems } = useQuery({
    queryKey: ["checkoutVenueItems", restaurant],
    enabled: !!restaurant,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/restaurants/v1/restaurants/items/?restaurant=${restaurant}&page_size=200`
      );
      return res?.data?.data || [];
    },
  });

  const venueItems: any[] = Array.isArray(itemsData) ? itemsData : [];

  // Filtered menu items for quick add
  const filteredVenueItems = useMemo(() => {
    if (!itemSearch.trim()) return venueItems.slice(0, 12);
    const q = itemSearch.toLowerCase();
    return venueItems.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(q) ||
        item.item_code?.toLowerCase().includes(q) ||
        item.category?.name?.toLowerCase().includes(q)
    );
  }, [venueItems, itemSearch]);

  // Financial calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum: number, it: any) => {
      const price = Number(it.selling_price || it.price || 0);
      const qty = Number(it.quantity || 1);
      return sum + price * qty;
    }, 0);
  }, [cart]);

  // Promo code validation
  const promoCodesList: any[] = promoCodeData?.data || [];

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setAppliedPromo(null);
      return;
    }

    const found = promoCodesList.find(
      (p: any) => p.promo_code?.toUpperCase() === code
    );

    if (!found) {
      // Backend will still validate on submission, but we give immediate UI feedback
      setAppliedPromo({
        code: promoCodeInput.trim(),
        discountAmount: 0,
        isValid: false,
        message: "Code not recognized in cache (will verify on submit)",
      });
      return;
    }

    let discount = 0;
    if (found.percentage != null) {
      discount = (Number(found.percentage) / 100) * subtotal;
    } else if (found.amount != null) {
      discount = Number(found.amount);
    }
    if (discount > subtotal) discount = subtotal;

    setAppliedPromo({
      code: found.promo_code,
      discountAmount: discount,
      isValid: true,
      raw: found,
    });
    toast.success(`Promo code applied! Saved ৳${discount.toFixed(2)}`);
  };

  const discountAmount = appliedPromo?.isValid ? appliedPromo.discountAmount : 0;
  const netTotal = Math.max(0, subtotal - discountAmount);

  // Form submission: create direct invoice
  const handleGenerateInvoice = async () => {
    if (!restaurant) {
      toast.error("Please select a dining venue first.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty. Please add items to create an invoice.");
      return;
    }
    if (!selectedMember) {
      toast.error("Please select a club member account to bill this invoice.");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: any = {
        restaurant: Number(restaurant),
        member_ID: selectedMember.member_ID,
        restaurant_items: cart.map((it: any) => ({
          id: it.id,
          quantity: Number(it.quantity || 1),
        })),
      };

      if (appliedPromo?.code) {
        requestData.promo_code = appliedPromo.code;
      } else if (promoCodeInput.trim()) {
        requestData.promo_code = promoCodeInput.trim();
      }

      const response = await axiosInstance.post(
        "/api/restaurants/v1/restaurants/items/buy/",
        requestData
      );

      if (response.status === 201) {
        const createdInvoice = response.data?.data || {};

        // Snapshot for receipt
        setInvoiceSnapshot({
          items: [...cart],
          member: { ...selectedMember },
          venueName: currentVenue?.name || "Saint Club Restaurant",
          subtotal,
          discount: discountAmount,
          finalTotal: netTotal,
        });

        setSuccessInvoice(createdInvoice);
        toast.success("Member invoice generated successfully!");
        clearCart();
        setPromoCodeInput("");
        setAppliedPromo(null);
      }
    } catch (error: any) {
      console.error("Invoice creation failed", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.non_field_errors?.[0] ||
        "Failed to generate member invoice. Please verify details.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dedicated thermal receipt popup printer
  const handlePrintReceipt = () => {
    const printable = document.getElementById("thermal-receipt-printable");
    if (!printable) {
      window.print();
      return;
    }

    const printWin = window.open("", "_blank", "width=380,height=620");
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - ${successInvoice?.invoice_number || "Invoice"}</title>
            <style>
              @page { size: 80mm auto; margin: 4mm; }
              body {
                font-family: 'Courier New', Courier, monospace;
                font-size: 11px;
                line-height: 1.35;
                color: #000;
                margin: 0;
                padding: 6px;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .dashed-line { border-bottom: 1px dashed #000; margin: 6px 0; }
              .double-line { border-bottom: 2px dashed #000; margin: 6px 0; }
              .flex-row { display: flex; justify-content: space-between; }
              table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 11px; }
              th, td { padding: 2px 0; text-align: left; }
              th.r, td.r { text-align: right; }
              .stamp {
                display: inline-block;
                border: 1px solid #000;
                padding: 2px 6px;
                font-weight: bold;
                margin-top: 4px;
                text-transform: uppercase;
              }
            </style>
          </head>
          <body>
            ${printable.innerHTML}
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 350);
    } else {
      window.print();
    }
  };

  const handleResetForm = () => {
    setSelectedMember(null);
    setPromoCodeInput("");
    setAppliedPromo(null);
    clearCart();
    toast.info("Invoice form cleared");
  };

  return (
    <div className="space-y-6 font-primary">
      {/* ── TOP VENUE & QUICK CONTROL BAR ────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Active Dining Venue
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Select
                value={restaurant ? String(restaurant) : ""}
                onValueChange={(val) => {
                  setRestaurant(Number(val));
                  toast.info(`Switched venue to ${venues.find((v) => v.id === Number(val))?.name || "venue"}`);
                }}
              >
                <SelectTrigger className="w-[220px] sm:w-[260px] h-9 text-xs font-semibold bg-background border-border/80 focus:ring-primary/20">
                  <SelectValue placeholder="Select Venue..." />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((v: any) => (
                    <SelectItem key={v.id} value={String(v.id)} className="text-xs font-medium">
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentVenue && (
                <Badge variant="outline" className="hidden md:inline-flex text-[10px] font-mono border-primary/20 bg-primary/5 text-primary">
                  {currentVenue.cuisine || "Lounge"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Cart Count & Quick Reset */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Badge variant="secondary" className="gap-1.5 h-8 px-3 text-xs font-semibold bg-muted border border-border/60">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            <span>{cart.length} in Cart</span>
          </Badge>

          {cart.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/80"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Cart
            </Button>
          )}
        </div>
      </div>

      {/* ── IN-PLACE DISH QUICK-ADD SEARCH & CATALOG ──────────────── */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Quick-Add Menu Items
            </h3>
            <p className="text-xs text-muted-foreground">
              Search and add items to this invoice directly from {currentVenue?.name || "the venue menu"}.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search dish or beverage..."
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-background border-border/80 focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {/* Quick Item Chips */}
        {isLoadingItems ? (
          <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
            Loading menu items...
          </div>
        ) : filteredVenueItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pt-1">
            {filteredVenueItems.map((item: any) => {
              const inCart = cart.find((c: any) => c.id === item.id);
              const price = Number(item.selling_price || item.price || 0);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/60 hover:border-primary/40 hover:bg-muted/50 transition-all text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-foreground truncate">{item.name}</p>
                    <p className="font-mono text-primary font-bold text-[11px] mt-0.5">
                      ৳{price.toFixed(2)}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={inCart ? "secondary" : "outline"}
                    onClick={() => {
                      addItem(item, 1);
                      toast.success(`Added ${item.name} to cart`, { autoClose: 1200 });
                    }}
                    className={cn(
                      "h-7 px-2 text-[11px] gap-1 font-semibold shrink-0 shadow-2xs",
                      inCart && "border-primary/30 text-primary bg-primary/10"
                    )}
                  >
                    <Plus className="w-3 h-3" />
                    {inCart ? `${inCart.quantity}` : "Add"}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-3 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
            No items matching &ldquo;{itemSearch}&rdquo; in this venue.
          </div>
        )}
      </div>

      {/* ── MAIN WORKSPACE: CART (LEFT) & BILLING DETAILS (RIGHT) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: SELECTED ORDER ITEMS CART (7 COLS) */}
        <div className="lg:col-span-7 bg-card rounded-2xl border border-border/80 shadow-xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                Selected Order Items
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {cart.length} item{cart.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-2.5">
            {!mounted ? (
              <p className="text-muted-foreground text-xs italic py-4 text-center">Loading cart...</p>
            ) : cart.length > 0 ? (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {cart.map((item: any) => {
                  const price = Number(item.selling_price || item.price || 0);
                  const qty = Number(item.quantity || 1);
                  const lineTotal = price * qty;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-xl p-3 bg-muted/25 border border-border/50 hover:border-border transition-colors gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs text-foreground truncate">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Unit: <span className="font-mono text-foreground font-medium">৳{price.toFixed(2)}</span>
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-background border border-border/80 rounded-lg p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-mono font-semibold text-xs px-1 min-w-[20px] text-center">
                          {qty}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0 min-w-[70px]">
                        <p className="text-xs font-mono font-bold text-foreground">
                          ৳{lineTotal.toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-7 w-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border/80 space-y-2">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs font-medium text-foreground">No items in checkout cart</p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  Pick dishes from the quick-add catalog above or visit a dining venue to add items.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MEMBER SELECTION, PROMO & INVOICE SUMMARY (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          {/* MEMBER SELECTION CARD */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Billed Member Account</h3>
              </div>
              {selectedMember && (
                <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
                  Verified Member
                </Badge>
              )}
            </div>

            {/* Universal MemberSelectModal */}
            <MemberSelectModal
              value={
                selectedMember
                  ? {
                      member_ID: selectedMember.member_ID,
                      name: selectedMember.name,
                      email: selectedMember.email,
                      phone: selectedMember.phone || selectedMember.contact_number,
                      membership_type: selectedMember.membership_type,
                      membership_status: selectedMember.membership_status,
                    }
                  : null
              }
              onSelect={(m) => setSelectedMember(m)}
              onClear={() => setSelectedMember(null)}
              triggerLabel={selectedMember ? "Change Member..." : "Search & Select Member Account..."}
            />

            {/* Selected Member Details Card */}
            {selectedMember ? (
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{selectedMember.name}</span>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {selectedMember.member_ID}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap pt-0.5">
                  {(selectedMember.phone || selectedMember.contact_number) && (
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-muted-foreground/70" />
                      {selectedMember.phone || selectedMember.contact_number}
                    </span>
                  )}
                  {selectedMember.membership_type && (
                    <span className="capitalize">{selectedMember.membership_type}</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Invoices generated in this tab are debited directly to the member&apos;s monthly club ledger.
              </p>
            )}
          </div>

          {/* PROMO CODE CARD */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-500" />
              Promo Discount Code
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Percent className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Enter discount code..."
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyPromo();
                    }
                  }}
                  className="pl-9 h-9 text-xs font-mono uppercase bg-background border-border/80 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyPromo}
                className="h-9 px-3 text-xs font-semibold shrink-0"
              >
                Apply
              </Button>
            </div>

            {appliedPromo?.isValid && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between">
                <span>Code &ldquo;{appliedPromo.code}&rdquo; Applied</span>
                <span className="font-mono font-bold">-৳{discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* FINANCIAL SUMMARY & SUBMISSION */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2.5">
              Invoice Ledger Summary
            </h3>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-mono text-foreground font-semibold">৳{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Promo Discount</span>
                  <span className="font-mono font-semibold">-৳{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-border/60 pt-2 flex items-center justify-between text-sm">
                <span className="font-bold text-foreground">Total Balance Due</span>
                <span className="font-mono text-base font-extrabold text-primary">
                  ৳{netTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleGenerateInvoice}
                disabled={isSubmitting || cart.length === 0 || !selectedMember}
                className="w-full h-11 text-xs font-bold gap-2 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Receipt className="w-4 h-4" />
                {isSubmitting ? "Generating Invoice..." : "Generate Member Invoice"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetForm}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Clear All Fields
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── POST-CHECKOUT SUCCESS & THERMAL RECEIPT MODAL ────────── */}
      <Dialog open={!!successInvoice} onOpenChange={(open) => !open && setSuccessInvoice(null)}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl border-border/80">
          <DialogHeader className="p-5 pb-3 text-center bg-card border-b border-border/60">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Invoice Generated Successfully
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Official restaurant invoice recorded to member ledger.
            </p>
          </DialogHeader>

          {/* Printable Receipt Preview Body */}
          <div className="p-5 space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar">
            <div
              id="thermal-receipt-printable"
              className="p-4 bg-muted/40 rounded-xl border border-border/60 font-mono text-xs space-y-3"
            >
              {/* Header */}
              <div className="text-center space-y-0.5 border-b border-dashed border-border/80 pb-2">
                <p className="font-bold text-sm tracking-wide">SAINT CLUB LTD.</p>
                <p className="text-[10px] text-muted-foreground uppercase">{invoiceSnapshot?.venueName}</p>
                <p className="text-[10px] text-muted-foreground">Club Dining &amp; POS Services</p>
              </div>

              {/* Invoice Meta */}
              <div className="space-y-1 text-[11px] border-b border-dashed border-border/80 pb-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice No:</span>
                  <span className="font-bold">{successInvoice?.invoice_number || "INV-NEW"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member:</span>
                  <span className="font-semibold">{invoiceSnapshot?.member?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member ID:</span>
                  <span>{invoiceSnapshot?.member?.member_ID}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-b border-dashed border-border/80 pb-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase pb-1">
                  <span>Item</span>
                  <span>Qty × Rate</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="space-y-1">
                  {invoiceSnapshot?.items?.map((it: any, idx: number) => {
                    const price = Number(it.selling_price || it.price || 0);
                    const qty = Number(it.quantity || 1);
                    return (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="truncate max-w-[130px]">{it.name}</span>
                        <span>{qty} × {price.toFixed(0)}</span>
                        <span className="text-right font-bold">{(price * qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{invoiceSnapshot?.subtotal?.toFixed(2)}</span>
                </div>
                {Number(invoiceSnapshot?.discount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-৳{invoiceSnapshot?.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-dashed border-border/80 pt-1.5 mt-1">
                  <span>Total Amount:</span>
                  <span>৳{invoiceSnapshot?.finalTotal?.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-2 text-[10px] text-muted-foreground border-t border-dashed border-border/80">
                <p>Status: UNPAID (Account Ledger)</p>
                <p>Thank you for dining at Saint Club.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/30 border-t border-border/60 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintReceipt}
              className="gap-2 text-xs font-semibold h-9 flex-1"
            >
              <Printer className="w-3.5 h-3.5 text-primary" /> Print Thermal Slip
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSuccessInvoice(null);
                setInvoiceSnapshot(null);
              }}
              className="text-xs font-semibold h-9 flex-1"
            >
              New Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
