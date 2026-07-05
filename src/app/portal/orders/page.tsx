"use client";

import { useState } from "react";
import { useMyOrders } from "@/hooks/data/usePortal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingDots } from "@/components/ui/loading";

const STATUS_TONE: Record<string, any> = {
  pending_otp: "secondary",
  confirmed: "default",
  preparing: "default",
  ready: "default",
  served: "default",
  billed: "outline",
  cancelled: "destructive",
};

export default function MyOrdersPage() {
  const [kind, setKind] = useState<"all" | "restaurant" | "outlet">("all");
  const { data: orders, isLoading } = useMyOrders(
    kind === "all" ? undefined : kind
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <Tabs value={kind} onValueChange={(v: any) => setKind(v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="restaurant">Food</TabsTrigger>
          <TabsTrigger value="outlet">Bar & Lounge</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <LoadingDots />
      ) : !orders || orders.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          You haven't placed any orders yet.
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <Card key={`${o.order_kind}-${o.id}`} className="p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{o.order_number}</p>
                    <Badge variant="outline" className="capitalize">
                      {o.order_kind === "restaurant" ? "Food" : "Bar/Lounge"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleString()
                      : ""}
                  </p>
                  {o.items && o.items.length > 0 && (
                    <p className="text-sm mt-1">
                      {o.items
                        .map(
                          (it: any) =>
                            `${it.item_name || it.name || "Item"} ×${
                              it.quantity
                            }`
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <Badge
                    variant={STATUS_TONE[o.status] || "default"}
                    className="capitalize"
                  >
                    {String(o.status).replace("_", " ")}
                  </Badge>
                  <p className="font-semibold mt-1">
                    BDT {o.grand_total ?? o.total ?? o.sub_total ?? "—"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
