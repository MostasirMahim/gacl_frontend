"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetOutlets from "@/hooks/data/useGetOutlets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingDots } from "@/components/ui/loading";
import { Plus, ArrowUpDown } from "lucide-react";

function useInventoryItems(outletId?: number) {
  return useQuery({
    queryKey: ["outletInventoryItems", outletId],
    queryFn: async () => {
      const q = outletId ? `?outlet_id=${outletId}` : "";
      const res = await axiosInstance.get(
        `/api/outlet/v1/outlets/inventory/items/${q}`
      );
      return res?.data;
    },
  });
}

function useInventoryMovements(outletId?: number) {
  return useQuery({
    queryKey: ["outletInventoryMovements", outletId],
    queryFn: async () => {
      const q = outletId ? `?outlet_id=${outletId}` : "";
      const res = await axiosInstance.get(
        `/api/outlet/v1/outlets/inventory/movements/${q}`
      );
      return res?.data;
    },
  });
}

export default function OutletInventory() {
  const queryClient = useQueryClient();
  const { data: outletsData } = useGetOutlets();
  const outlets = outletsData?.data || [];
  const [outletId, setOutletId] = useState<number | undefined>(undefined);

  const { data: itemsData, isLoading } = useInventoryItems(outletId);
  const items = itemsData?.data || [];
  const { data: moveData } = useInventoryMovements(outletId);
  const movements = moveData?.data || [];

  // add item form
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<any>({
    name: "",
    unit: "",
    current_quantity: "",
    reorder_level: "",
    unit_cost: "",
    outlet: "",
  });

  // movement form
  const [moveItem, setMoveItem] = useState<any>(null);
  const [moveVals, setMoveVals] = useState<any>({ movement: "in", quantity: "", reason: "" });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["outletInventoryItems"] });
    queryClient.invalidateQueries({ queryKey: ["outletInventoryMovements"] });
  };

  async function addItem() {
    if (!newItem.name || !newItem.outlet)
      return toast.error("Name and outlet are required");
    try {
      await axiosInstance.post("/api/outlet/v1/outlets/inventory/items/", {
        ...newItem,
        current_quantity:
          newItem.current_quantity === "" ? 0 : Number(newItem.current_quantity),
        reorder_level:
          newItem.reorder_level === "" ? 0 : Number(newItem.reorder_level),
        unit_cost: newItem.unit_cost === "" ? 0 : Number(newItem.unit_cost),
        outlet: Number(newItem.outlet),
      });
      toast.success("Inventory item added");
      setShowAdd(false);
      setNewItem({
        name: "",
        unit: "",
        current_quantity: "",
        reorder_level: "",
        unit_cost: "",
        outlet: "",
      });
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add item");
    }
  }

  async function recordMovement() {
    if (!moveVals.quantity) return toast.error("Quantity required");
    try {
      await axiosInstance.post("/api/outlet/v1/outlets/inventory/movements/", {
        inventory_item: moveItem.id,
        movement: moveVals.movement,
        quantity: Number(moveVals.quantity),
        reason: moveVals.reason,
      });
      toast.success("Stock movement recorded");
      setMoveItem(null);
      setMoveVals({ movement: "in", quantity: "", reason: "" });
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to record movement");
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Inventory Management</h2>
        <div className="flex items-end gap-3">
          <Select
            value={outletId ? String(outletId) : "all"}
            onValueChange={(v) => setOutletId(v === "all" ? undefined : Number(v))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All outlets</SelectItem>
              {outlets.map((o: any) => (
                <SelectItem key={o.id} value={String(o.id)}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Inventory Items</TabsTrigger>
          <TabsTrigger value="movements">Stock Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          {isLoading ? (
            <LoadingDots />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it: any) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.name}</TableCell>
                    <TableCell>{it.current_quantity}</TableCell>
                    <TableCell>{it.unit}</TableCell>
                    <TableCell>{it.reorder_level}</TableCell>
                    <TableCell>
                      <Badge variant={it.is_low ? "destructive" : "default"}>
                        {it.is_low ? "Low stock" : "OK"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => setMoveItem(it)}
                      >
                        <ArrowUpDown className="w-4 h-4" /> Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No inventory items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="movements" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Movement</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell>{m.inventory_item_name}</TableCell>
                  <TableCell>
                    <Badge variant={m.movement === "in" ? "default" : "secondary"}>
                      {m.movement === "in" ? "Stock In" : "Stock Out"}
                    </Badge>
                  </TableCell>
                  <TableCell>{m.quantity}</TableCell>
                  <TableCell>{m.reason || "—"}</TableCell>
                  <TableCell>{new Date(m.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No stock transactions
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Add item dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Outlet</label>
              <Select
                value={newItem.outlet ? String(newItem.outlet) : ""}
                onValueChange={(v) => setNewItem({ ...newItem, outlet: v })}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Unit</label>
                <Input
                  placeholder="kg / pcs / L"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Quantity</label>
                <Input
                  type="number"
                  min={0}
                  value={newItem.current_quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, current_quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Reorder Level</label>
                <Input
                  type="number"
                  min={0}
                  value={newItem.reorder_level}
                  onChange={(e) =>
                    setNewItem({ ...newItem, reorder_level: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Unit Cost</label>
                <Input
                  type="number"
                  min={0}
                  value={newItem.unit_cost}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unit_cost: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={addItem} className="w-full">
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Movement dialog */}
      <Dialog open={!!moveItem} onOpenChange={(o) => !o && setMoveItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock — {moveItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Movement</label>
              <Select
                value={moveVals.movement}
                onValueChange={(v) => setMoveVals({ ...moveVals, movement: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In (add)</SelectItem>
                  <SelectItem value="out">Stock Out (remove)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Quantity</label>
              <Input
                type="number"
                min={0}
                value={moveVals.quantity}
                onChange={(e) =>
                  setMoveVals({ ...moveVals, quantity: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Reason</label>
              <Input
                value={moveVals.reason}
                onChange={(e) =>
                  setMoveVals({ ...moveVals, reason: e.target.value })
                }
              />
            </div>
            <Button onClick={recordMovement} className="w-full">
              Record Movement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
