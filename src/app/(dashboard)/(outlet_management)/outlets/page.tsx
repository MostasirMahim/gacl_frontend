"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OutletForm from "@/components/outlet/OutletForm";
import OutletItemForm from "@/components/outlet/OutletItemForm";
import CrossOrderingRules from "@/components/outlet/CrossOrderingRules";
import OutletKitchenDisplay from "@/components/outlet/OutletKitchenDisplay";
import OutletOrdersList from "@/components/outlet/OutletOrdersList";

export default function OutletsPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Outlets — Bar / Tea Lounge / Cigar Lounge</h1>
      <Tabs defaultValue="kitchen">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="kitchen">Preparation Queue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="outlets">Create Outlet</TabsTrigger>
          <TabsTrigger value="items">Post Item</TabsTrigger>
          <TabsTrigger value="rules">Cross-Ordering Rules</TabsTrigger>
        </TabsList>
        <TabsContent value="kitchen" className="mt-4">
          <OutletKitchenDisplay />
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <OutletOrdersList />
        </TabsContent>
        <TabsContent value="outlets" className="mt-4">
          <OutletForm />
        </TabsContent>
        <TabsContent value="items" className="mt-4">
          <OutletItemForm />
        </TabsContent>
        <TabsContent value="rules" className="mt-4">
          <CrossOrderingRules />
        </TabsContent>
      </Tabs>
    </div>
  );
}
