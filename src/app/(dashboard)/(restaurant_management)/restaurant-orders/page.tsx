"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KitchenDisplay from "@/components/restaurant_ordering/KitchenDisplay";
import OrdersList from "@/components/restaurant_ordering/OrdersList";

export default function RestaurantOrdersPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Restaurant Ordering</h1>
      <Tabs defaultValue="kitchen">
        <TabsList>
          <TabsTrigger value="kitchen">Kitchen Display</TabsTrigger>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="kitchen" className="mt-4">
          <KitchenDisplay />
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <OrdersList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
