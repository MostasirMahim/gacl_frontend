"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { LoadingDots } from "@/components/ui/loading";
import { Pencil } from "lucide-react";

export default function RestaurantManagePanel({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const queryClient = useQueryClient();

  const { data: detailData, isLoading: loadingDetail } = useQuery({
    queryKey: ["restaurantDetail", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/restaurants/v1/restaurants/${restaurantId}/detail/`
      );
      return res?.data;
    },
  });
  const restaurant = detailData?.data;

  const { data: itemsData, isLoading: loadingItems } = useQuery({
    queryKey: ["restaurantItemsManage", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/restaurants/v1/restaurants/items/?restaurant=${restaurantId}`
      );
      return res?.data;
    },
  });
  const items = itemsData?.data || [];

  const [editingRestaurant, setEditingRestaurant] = useState(false);
  const [rv, setRv] = useState<any>({});
  const [editItem, setEditItem] = useState<any>(null);
  const [iv, setIv] = useState<any>({});

  function startEditRestaurant() {
    setRv({
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      address: restaurant?.address || "",
      city: restaurant?.city || "",
      phone: restaurant?.phone || "",
      capacity: restaurant?.capacity ?? "",
      status: restaurant?.status || "open",
    });
    setEditingRestaurant(true);
  }

  async function saveRestaurant() {
    try {
      await axiosInstance.patch(
        `/api/restaurants/v1/restaurants/${restaurantId}/detail/`,
        { ...rv, capacity: rv.capacity === "" ? 0 : Number(rv.capacity) }
      );
      toast.success("Restaurant updated");
      setEditingRestaurant(false);
      queryClient.invalidateQueries({ queryKey: ["restaurantDetail", restaurantId] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  }

  function startEditItem(it: any) {
    setEditItem(it);
    setIv({
      name: it.name,
      selling_price: it.selling_price ?? it.price ?? "",
      availability: it.availability ?? true,
    });
  }

  async function saveItem() {
    try {
      await axiosInstance.patch(
        `/api/restaurants/v1/restaurants/items/${editItem.id}/detail/`,
        {
          ...iv,
          selling_price:
            iv.selling_price === "" ? 0 : Number(iv.selling_price),
        }
      );
      toast.success("Item updated");
      setEditItem(null);
      queryClient.invalidateQueries({
        queryKey: ["restaurantItemsManage", restaurantId],
      });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">Restaurant Overview</h2>
          <Button variant="outline" size="sm" onClick={startEditRestaurant} className="gap-2">
            <Pencil className="w-4 h-4" /> Edit
          </Button>
        </div>
        {loadingDetail ? (
          <LoadingDots />
        ) : restaurant ? (
          <div className="grid gap-3 md:grid-cols-2 mt-4 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {restaurant.name}</div>
            <div><span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant={restaurant.status === "open" ? "default" : "secondary"}>
                {restaurant.status}
              </Badge>
            </div>
            <div><span className="text-muted-foreground">City:</span> {restaurant.city}</div>
            <div><span className="text-muted-foreground">Phone:</span> {restaurant.phone}</div>
            <div><span className="text-muted-foreground">Capacity:</span> {restaurant.capacity}</div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Description:</span>{" "}
              {restaurant.description}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground mt-4">Could not load restaurant.</p>
        )}
      </div>

      {/* Items management */}
      <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        {loadingItems ? (
          <LoadingDots />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it: any) => (
                <TableRow key={it.id}>
                  <TableCell className="font-medium">{it.name}</TableCell>
                  <TableCell>{it.selling_price ?? it.price}</TableCell>
                  <TableCell>
                    <Badge variant={it.availability ? "default" : "secondary"}>
                      {it.availability ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => startEditItem(it)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No items
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit restaurant dialog */}
      <Dialog open={editingRestaurant} onOpenChange={setEditingRestaurant}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input value={rv.name || ""} onChange={(e) => setRv({ ...rv, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Description</label>
              <Textarea value={rv.description || ""} onChange={(e) => setRv({ ...rv, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">City</label>
                <Input value={rv.city || ""} onChange={(e) => setRv({ ...rv, city: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Phone</label>
                <Input value={rv.phone || ""} onChange={(e) => setRv({ ...rv, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Capacity</label>
                <Input type="number" min={0} value={rv.capacity ?? ""} onChange={(e) => setRv({ ...rv, capacity: e.target.value })} />
              </div>
            </div>
            <Button onClick={saveRestaurant} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit item dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input value={iv.name || ""} onChange={(e) => setIv({ ...iv, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Selling Price</label>
              <Input type="number" min={0} value={iv.selling_price ?? ""} onChange={(e) => setIv({ ...iv, selling_price: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={iv.availability} onCheckedChange={(v) => setIv({ ...iv, availability: v })} />
              <span className="text-sm">Available</span>
            </div>
            <Button onClick={saveItem} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
