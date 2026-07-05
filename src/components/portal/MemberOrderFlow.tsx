"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
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
import { LoadingDots } from "@/components/ui/loading";
import { Plus, Minus, Trash2, ShoppingCart, ShieldCheck } from "lucide-react";

type Kind = "restaurant" | "outlet";

interface CartLine {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  source?: string;
}

/**
 * Full member self-order flow:
 *   1. pick a venue (restaurant / outlet)
 *   2. add items to a cart
 *   3. place order -> backend sends an OTP to the member's own phone
 *   4. enter OTP to confirm
 * The member can only ever order as themselves (backend enforces this).
 */
export default function MemberOrderFlow({ kind }: { kind: Kind }) {
  const queryClient = useQueryClient();
  const isRestaurant = kind === "restaurant";

  const venueLabel = isRestaurant ? "Restaurant" : "Outlet";
  const venuesUrl = isRestaurant
    ? "/api/restaurants/v1/restaurants/"
    : "/api/outlet/v1/outlets/";

  const [venueId, setVenueId] = useState<number | undefined>();
  const [serveLocation, setServeLocation] = useState("restaurant");
  const [roomNumber, setRoomNumber] = useState("");
  const [note, setNote] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);

  // OTP stage state
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [placing, setPlacing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { data: venuesData } = useQuery({
    queryKey: ["portalVenues", kind],
    queryFn: async () => {
      const res = await axiosInstance.get(venuesUrl);
      return res?.data;
    },
  });
  const venues = venuesData?.data || [];

  const { data: itemsData, isLoading: loadingItems } = useQuery({
    queryKey: ["portalItems", kind, venueId],
    enabled: !!venueId,
    queryFn: async () => {
      const url = isRestaurant
        ? `/api/restaurants/v1/restaurants/items/?restaurant=${venueId}`
        : `/api/outlet/v1/outlets/items/?outlet_id=${venueId}`;
      const res = await axiosInstance.get(url);
      return res?.data;
    },
  });
  const items = (itemsData?.data || []).filter(
    (i: any) => i.availability !== false
  );

  const venueTypeForSource = (() => {
    const v = venues.find((x: any) => x.id === venueId);
    return v?.outlet_type || "bar";
  })();

  function addItem(item: any) {
    const price = Number(item.selling_price ?? item.price ?? 0);
    setCart((c) => {
      const found = c.find((x) => x.item_id === item.id);
      if (found) {
        return c.map((x) =>
          x.item_id === item.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [
        ...c,
        {
          item_id: item.id,
          name: item.name,
          price,
          quantity: 1,
          source: isRestaurant ? undefined : venueTypeForSource,
        },
      ];
    });
  }

  function changeQty(itemId: number, delta: number) {
    setCart((c) =>
      c
        .map((x) =>
          x.item_id === itemId
            ? { ...x, quantity: Math.max(0, x.quantity + delta) }
            : x
        )
        .filter((x) => x.quantity > 0)
    );
  }

  const total = cart.reduce((s, x) => s + x.price * x.quantity, 0);

  async function placeOrder() {
    if (!venueId) return toast.error(`Select a ${venueLabel.toLowerCase()}`);
    if (cart.length === 0) return toast.error("Your cart is empty");
    setPlacing(true);
    try {
      const url = isRestaurant
        ? "/api/restaurants/v1/restaurants/orders/"
        : "/api/outlet/v1/outlets/orders/";
      const payload: any = isRestaurant
        ? {
            restaurant_id: venueId,
            serve_location: serveLocation,
            room_number: serveLocation === "room" ? roomNumber : "",
            note,
            require_otp: true,
            items: cart.map((x) => ({
              item_id: x.item_id,
              quantity: x.quantity,
            })),
          }
        : {
            outlet_id: venueId,
            room_number: roomNumber,
            note,
            require_otp: true,
            items: cart.map((x) => ({
              source: x.source,
              item_id: x.item_id,
              quantity: x.quantity,
            })),
          };
      const res = await axiosInstance.post(url, payload);
      const order = res?.data?.data;
      setPlacedOrder(order);
      toast.success("Order placed! An OTP has been sent to your phone.");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  }

  async function confirmOtp() {
    if (!otp.trim()) return toast.error("Enter the OTP");
    setConfirming(true);
    try {
      const url = isRestaurant
        ? `/api/restaurants/v1/restaurants/orders/${placedOrder.id}/verify-otp/`
        : `/api/outlet/v1/outlets/orders/${placedOrder.id}/verify-otp/`;
      await axiosInstance.post(url, { otp_code: otp.trim() });
      toast.success("Order confirmed! It's now being prepared.");
      // reset the whole flow
      setPlacedOrder(null);
      setOtp("");
      setCart([]);
      setNote("");
      setRoomNumber("");
      queryClient.invalidateQueries({ queryKey: ["portalOrders"] });
      queryClient.invalidateQueries({ queryKey: ["portalDashboard"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Invalid OTP");
    } finally {
      setConfirming(false);
    }
  }

  // ---- OTP confirmation stage ----
  if (placedOrder) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Confirm your order</h2>
          <p className="text-sm text-muted-foreground">
            We sent a one-time code to your registered phone number. Enter it
            below to confirm order{" "}
            <span className="font-medium">{placedOrder.order_number}</span>.
          </p>
        </div>
        <Input
          className="text-center text-lg tracking-widest"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />
        <Button
          className="w-full"
          onClick={confirmOtp}
          disabled={confirming}
        >
          {confirming ? "Confirming..." : "Confirm Order"}
        </Button>
        <button
          className="text-sm text-muted-foreground underline"
          onClick={() => {
            setPlacedOrder(null);
            setOtp("");
          }}
        >
          Cancel
        </button>
      </Card>
    );
  }

  // ---- Ordering stage ----
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isRestaurant ? "Order Food" : "Bar & Lounge"}
        </h1>
        <p className="text-muted-foreground">
          Choose a {venueLabel.toLowerCase()}, add items, and confirm with the
          OTP sent to your phone.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Menu */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground">
                  {venueLabel}
                </label>
                <Select
                  value={venueId ? String(venueId) : ""}
                  onValueChange={(v) => {
                    setVenueId(Number(v));
                    setCart([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Select a ${venueLabel.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((v: any) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isRestaurant && (
                <div>
                  <label className="text-xs text-muted-foreground">
                    Serve at
                  </label>
                  <Select value={serveLocation} onValueChange={setServeLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="room">My Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {((isRestaurant && serveLocation === "room") || !isRestaurant) && (
              <div>
                <label className="text-xs text-muted-foreground">
                  Room number {isRestaurant ? "" : "(optional)"}
                </label>
                <Input
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 204"
                />
              </div>
            )}
          </Card>

          {!venueId ? (
            <Card className="p-10 text-center text-muted-foreground">
              Select a {venueLabel.toLowerCase()} to see the menu.
            </Card>
          ) : loadingItems ? (
            <LoadingDots />
          ) : items.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">
              No items available right now.
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((item: any) => (
                <Card
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      BDT {item.selling_price ?? item.price}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => addItem(item)} className="gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div>
          <Card className="p-4 sticky top-24 space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <ShoppingCart className="w-4 h-4" /> Your Cart
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No items yet
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((x) => (
                  <div key={x.item_id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{x.name}</p>
                      <p className="text-xs text-muted-foreground">
                        BDT {x.price} × {x.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => changeQty(x.item_id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">
                        {x.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => changeQty(x.item_id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-600"
                        onClick={() => changeQty(x.item_id, -x.quantity)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div>
                  <label className="text-xs text-muted-foreground">Note</label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special instruction?"
                  />
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">BDT {total.toFixed(2)}</span>
                </div>
              </div>
            )}
            <Button
              className="w-full"
              disabled={cart.length === 0 || placing}
              onClick={placeOrder}
            >
              {placing ? "Placing..." : "Place Order"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              You'll receive an OTP on your phone to confirm.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
