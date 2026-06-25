"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MemberSelectModal from "@/components/shared/MemberSelectModal";
import { Plus, Trash2 } from "lucide-react";

function useRestaurants() {
  return useQuery({
    queryKey: ["orderCreateRestaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/restaurants/v1/restaurants/");
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
        `/api/restaurants/v1/restaurants/items/?restaurant=${restaurantId}`
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

export default function RestaurantOrderCreate() {
  const queryClient = useQueryClient();
  const { data: restData } = useRestaurants();
  const restaurants = restData?.data || [];
  const [restaurantId, setRestaurantId] = useState<number | undefined>(undefined);
  const { data: itemsData } = useRestaurantItems(restaurantId);
  const items = itemsData?.data || [];
  const { data: spicyData } = useSpicyLevels();
  const spicyLevels = spicyData?.data || [];

  const [member, setMember] = useState<any>(null);
  const [placedBy, setPlacedBy] = useState("waiter");
  const [serveLocation, setServeLocation] = useState("restaurant");
  const [roomNumber, setRoomNumber] = useState("");
  const [note, setNote] = useState("");
  const [requireOtp, setRequireOtp] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [selItem, setSelItem] = useState("");
  const [selSpicy, setSelSpicy] = useState("");
  const [qty, setQty] = useState("1");
  const [loading, setLoading] = useState(false);

  function addToCart() {
    if (!selItem) return toast.error("Choose an item");
    const item = items.find((i: any) => String(i.id) === selItem);
    if (!item) return;
    const quantity = Number(qty) || 1;
    const spicy = selSpicy
      ? spicyLevels.find((s: any) => String(s.id) === selSpicy)
      : null;
    setCart((c) => [
      ...c,
      {
        item_id: item.id,
        name: item.name,
        price: item.selling_price ?? item.price ?? 0,
        quantity,
        spicy_level_id: spicy?.id || null,
        spicy_label: spicy?.name || "",
      },
    ]);
    setSelItem("");
    setSelSpicy("");
    setQty("1");
  }

  function removeFromCart(idx: number) {
    setCart((c) => c.filter((_, i) => i !== idx));
  }

  const total = cart.reduce(
    (sum, x) => sum + Number(x.price || 0) * x.quantity,
    0
  );

  async function placeOrder() {
    if (!restaurantId) return toast.error("Select a restaurant");
    if (!member) return toast.error("Select a member");
    if (cart.length === 0) return toast.error("Add at least one item");
    setLoading(true);
    try {
      const payload = {
        restaurant_id: restaurantId,
        member_id: member.id,
        placed_by: placedBy,
        serve_location: serveLocation,
        room_number: roomNumber,
        note,
        require_otp: requireOtp,
        items: cart.map((x) => ({
          item_id: x.item_id,
          quantity: x.quantity,
          spicy_level_id: x.spicy_level_id,
        })),
      };
      await axiosInstance.post("/api/restaurants/v1/restaurants/orders/", payload);
      toast.success(requireOtp ? "Order created — OTP sent" : "Order created");
      setCart([]);
      setMember(null);
      setRoomNumber("");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["getRestaurantOrders"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Create Restaurant Order</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs text-muted-foreground">Restaurant</label>
          <Select
            value={restaurantId ? String(restaurantId) : ""}
            onValueChange={(v) => {
              setRestaurantId(Number(v));
              setCart([]);
            }}
          >
            <SelectTrigger>
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
        <div>
          <label className="text-xs text-muted-foreground">Member</label>
          <MemberSelectModal
            value={
              member ? { member_ID: member.member_ID, name: member.name } : null
            }
            onSelect={(m) => setMember(m)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Placed By</label>
          <Select value={placedBy} onValueChange={setPlacedBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="waiter">Waiter / Staff</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Serve Location</label>
          <Select value={serveLocation} onValueChange={setServeLocation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="room">Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {serveLocation === "room" && (
          <div>
            <label className="text-xs text-muted-foreground">Room Number</label>
            <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
          </div>
        )}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground">Note</label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={requireOtp} onCheckedChange={setRequireOtp} />
          <span className="text-sm">Require OTP confirmation</span>
        </div>
      </div>

      {/* Add items */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Items
        </h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground">Item</label>
            <Select value={selItem} onValueChange={setSelItem} disabled={!restaurantId}>
              <SelectTrigger>
                <SelectValue placeholder={restaurantId ? "Choose item" : "Select restaurant first"} />
              </SelectTrigger>
              <SelectContent>
                {items.map((i: any) => (
                  <SelectItem key={i.id} value={String(i.id)}>
                    {i.name} — BDT {i.selling_price ?? i.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[140px]">
            <label className="text-xs text-muted-foreground">Spicy (optional)</label>
            <Select value={selSpicy} onValueChange={setSelSpicy}>
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {spicyLevels.map((s: any) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-20">
            <label className="text-xs text-muted-foreground">Qty</label>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <Button onClick={addToCart} disabled={!restaurantId}>
            Add
          </Button>
        </div>

        {cart.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Spicy</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((x, idx) => (
                <TableRow key={idx}>
                  <TableCell>{x.name}</TableCell>
                  <TableCell>{x.spicy_label || "—"}</TableCell>
                  <TableCell>{x.quantity}</TableCell>
                  <TableCell>{x.price}</TableCell>
                  <TableCell>{(Number(x.price) * x.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => removeFromCart(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Total: BDT {total.toFixed(2)}</span>
        <Button onClick={placeOrder} disabled={loading} size="lg">
          {loading ? "Placing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
