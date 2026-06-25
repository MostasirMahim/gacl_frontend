"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetOutlets from "@/hooks/data/useGetOutlets";
import useGetOutletItems from "@/hooks/data/useGetOutletItems";
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

export default function OutletOrderCreate() {
  const queryClient = useQueryClient();
  const { data: outletsData } = useGetOutlets();
  const outlets = outletsData?.data || [];

  const [outletId, setOutletId] = useState<number | undefined>(undefined);
  const { data: itemsData } = useGetOutletItems(outletId);
  const items = itemsData?.data || [];

  const [member, setMember] = useState<any>(null);
  const [placedBy, setPlacedBy] = useState("waiter");
  const [roomNumber, setRoomNumber] = useState("");
  const [note, setNote] = useState("");
  const [requireOtp, setRequireOtp] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [selItem, setSelItem] = useState("");
  const [qty, setQty] = useState("1");
  const [loading, setLoading] = useState(false);

  function addToCart() {
    if (!selItem) return toast.error("Choose an item");
    const item = items.find((i: any) => String(i.id) === selItem);
    if (!item) return;
    const quantity = Number(qty) || 1;
    setCart((c) => {
      const existing = c.find((x) => x.item_id === item.id);
      if (existing) {
        return c.map((x) =>
          x.item_id === item.id ? { ...x, quantity: x.quantity + quantity } : x
        );
      }
      return [
        ...c,
        {
          item_id: item.id,
          name: item.name,
          price: item.selling_price,
          quantity,
          source: "outlet",
        },
      ];
    });
    setSelItem("");
    setQty("1");
  }

  function removeFromCart(id: number) {
    setCart((c) => c.filter((x) => x.item_id !== id));
  }

  const total = cart.reduce(
    (sum, x) => sum + Number(x.price || 0) * x.quantity,
    0
  );

  async function placeOrder() {
    if (!outletId) return toast.error("Select an outlet");
    if (!member) return toast.error("Select a member");
    if (cart.length === 0) return toast.error("Add at least one item");
    setLoading(true);
    try {
      const payload = {
        outlet_id: outletId,
        member_id: member.id,
        placed_by: placedBy,
        room_number: roomNumber,
        note,
        require_otp: requireOtp,
        items: cart.map((x) => ({
          source: x.source,
          item_id: x.item_id,
          quantity: x.quantity,
        })),
      };
      await axiosInstance.post("/api/outlet/v1/outlets/orders/", payload);
      toast.success(
        requireOtp ? "Order created — OTP sent" : "Order created"
      );
      setCart([]);
      setMember(null);
      setRoomNumber("");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["getOutletOrders"] });
      queryClient.invalidateQueries({ queryKey: ["getOutletKitchen"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Create Outlet Order</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs text-muted-foreground">Outlet</label>
          <Select
            value={outletId ? String(outletId) : ""}
            onValueChange={(v) => {
              setOutletId(Number(v));
              setCart([]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select outlet" />
            </SelectTrigger>
            <SelectContent>
              {outlets.map((o: any) => (
                <SelectItem key={o.id} value={String(o.id)}>
                  {o.name}
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
          <label className="text-xs text-muted-foreground">Room Number (optional)</label>
          <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
        </div>
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
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground">Item</label>
            <Select value={selItem} onValueChange={setSelItem} disabled={!outletId}>
              <SelectTrigger>
                <SelectValue placeholder={outletId ? "Choose item" : "Select outlet first"} />
              </SelectTrigger>
              <SelectContent>
                {items
                  .filter((i: any) => i.availability)
                  .map((i: any) => (
                    <SelectItem key={i.id} value={String(i.id)}>
                      {i.name} — BDT {i.selling_price}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-24">
            <label className="text-xs text-muted-foreground">Qty</label>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <Button onClick={addToCart} disabled={!outletId}>
            Add
          </Button>
        </div>

        {cart.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((x) => (
                <TableRow key={x.item_id}>
                  <TableCell>{x.name}</TableCell>
                  <TableCell>{x.quantity}</TableCell>
                  <TableCell>{x.price}</TableCell>
                  <TableCell>{(Number(x.price) * x.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => removeFromCart(x.item_id)}
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
        <span className="text-lg font-semibold">
          Total: BDT {total.toFixed(2)}
        </span>
        <Button onClick={placeOrder} disabled={loading} size="lg">
          {loading ? "Placing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
