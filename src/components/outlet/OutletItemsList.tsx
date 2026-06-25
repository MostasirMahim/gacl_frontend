"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetOutletItems from "@/hooks/data/useGetOutletItems";
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
import { Switch } from "@/components/ui/switch";
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
import { LoadingDots } from "@/components/ui/loading";
import { Pencil, Trash2 } from "lucide-react";

export default function OutletItemsList() {
  const queryClient = useQueryClient();
  const { data: outletsData } = useGetOutlets();
  const outlets = outletsData?.data || [];
  const [outletFilter, setOutletFilter] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetOutletItems(outletFilter);
  const allItems = data?.data || [];
  const items = search
    ? allItems.filter((i: any) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    : allItems;

  const [editItem, setEditItem] = useState<any>(null);
  const [ev, setEv] = useState<any>({});

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["getOutletItems"] });

  function startEdit(it: any) {
    setEditItem(it);
    setEv({
      name: it.name,
      unit: it.unit || "",
      unit_cost: it.unit_cost ?? "",
      selling_price: it.selling_price ?? "",
      availability: it.availability,
    });
  }

  async function saveEdit() {
    try {
      await axiosInstance.patch(`/api/outlet/v1/outlets/items/${editItem.id}/`, {
        ...ev,
        unit_cost: ev.unit_cost === "" ? 0 : Number(ev.unit_cost),
        selling_price: ev.selling_price === "" ? 0 : Number(ev.selling_price),
      });
      toast.success("Item updated");
      setEditItem(null);
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  }

  async function remove(id: number) {
    try {
      await axiosInstance.delete(`/api/outlet/v1/outlets/items/${id}/`);
      toast.success("Item deleted");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Outlet Items</h2>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Search</label>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Outlet</label>
          <Select
            value={outletFilter ? String(outletFilter) : "all"}
            onValueChange={(v) =>
              setOutletFilter(v === "all" ? undefined : Number(v))
            }
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
        </div>
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it: any) => (
              <TableRow key={it.id}>
                <TableCell className="font-medium">{it.name}</TableCell>
                <TableCell>{it.outlet_name || "—"}</TableCell>
                <TableCell>{it.category_name || "—"}</TableCell>
                <TableCell>{it.selling_price}</TableCell>
                <TableCell>
                  <Badge variant={it.availability ? "default" : "secondary"}>
                    {it.availability ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(it)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => remove(it.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input
                value={ev.name || ""}
                onChange={(e) => setEv({ ...ev, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Unit</label>
                <Input
                  value={ev.unit || ""}
                  onChange={(e) => setEv({ ...ev, unit: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cost</label>
                <Input
                  type="number"
                  min={0}
                  value={ev.unit_cost ?? ""}
                  onChange={(e) => setEv({ ...ev, unit_cost: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Price</label>
                <Input
                  type="number"
                  min={0}
                  value={ev.selling_price ?? ""}
                  onChange={(e) =>
                    setEv({ ...ev, selling_price: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={ev.availability}
                onCheckedChange={(v) => setEv({ ...ev, availability: v })}
              />
              <span className="text-sm">Available</span>
            </div>
            <Button onClick={saveEdit} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
