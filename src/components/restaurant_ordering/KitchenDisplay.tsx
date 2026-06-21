"use client";
import useGetKitchenOrders from "@/hooks/data/useGetKitchenOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";
import { ChefHat, Clock } from "lucide-react";

const NEXT_STATUS: Record<string, string> = {
  confirmed: "preparing",
  preparing: "ready",
  ready: "served",
};
const STATUS_LABEL: Record<string, string> = {
  confirmed: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Served",
};
const STATUS_COLOR: Record<string, string> = {
  confirmed: "default",
  preparing: "secondary",
  ready: "outline",
};

function KitchenDisplay({ restaurantId }: { restaurantId?: number }) {
  const { data, isLoading } = useGetKitchenOrders(restaurantId);
  const queryClient = useQueryClient();
  const orders = data?.data || [];

  async function advance(orderId: number, target: string) {
    try {
      await axiosInstance.patch(
        `/api/restaurants/v1/restaurants/kitchen/orders/${orderId}/status/`,
        { target_status: target }
      );
      toast.success(`Order moved to ${target}`);
      queryClient.invalidateQueries({ queryKey: ["getKitchenOrders"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  }

  if (isLoading) return <LoadingDots />;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ChefHat className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Kitchen Display</h2>
        <Badge variant="outline" className="ml-2">
          {orders.length} active
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o: any) => (
          <Card key={o.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold">{o.order_number}</span>
              <Badge variant={(STATUS_COLOR[o.status] as any) || "default"}>
                {o.status}
              </Badge>
            </div>
            {o.serve_location === "room" && (
              <p className="text-sm text-muted-foreground">Room: {o.room_number}</p>
            )}
            <ul className="text-sm space-y-1">
              {o.items?.map((it: any) => (
                <li key={it.id} className="flex justify-between">
                  <span>
                    {it.quantity}× {it.item_name}
                    {it.spicy_level_name && (
                      <span className="text-orange-500 ml-1">
                        ({it.spicy_level_name})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(o.created_at).toLocaleTimeString()}
            </div>
            {NEXT_STATUS[o.status] && (
              <Button
                size="sm"
                onClick={() => advance(o.id, NEXT_STATUS[o.status])}
              >
                {STATUS_LABEL[o.status]}
              </Button>
            )}
          </Card>
        ))}
        {orders.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No active orders in the kitchen.
          </p>
        )}
      </div>
    </div>
  );
}

export default KitchenDisplay;
