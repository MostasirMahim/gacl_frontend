"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OutletForm from "@/components/outlet/OutletForm";
import OutletItemForm from "@/components/outlet/OutletItemForm";
import OutletItemsList from "@/components/outlet/OutletItemsList";
import OutletCategoryManager from "@/components/outlet/OutletCategoryManager";
import CrossOrderingRules from "@/components/outlet/CrossOrderingRules";
import OutletKitchenDisplay from "@/components/outlet/OutletKitchenDisplay";
import OutletOrdersList from "@/components/outlet/OutletOrdersList";
import OutletOrderCreate from "@/components/outlet/OutletOrderCreate";
import OutletInventory from "@/components/outlet/OutletInventory";

export default function OutletsPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Outlets — Bar / Tea Lounge / Cigar Lounge</h1>
      <Tabs defaultValue="kitchen">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="kitchen">Preparation Queue</TabsTrigger>
          <TabsTrigger value="neworder">New Order</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="outlets">Outlets</TabsTrigger>
          <TabsTrigger value="items">Post Item</TabsTrigger>
          <TabsTrigger value="itemlist">Item List</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="rules">Cross-Ordering Rules</TabsTrigger>
        </TabsList>
        <TabsContent value="kitchen" className="mt-4">
          <OutletKitchenDisplay />
        </TabsContent>
        <TabsContent value="neworder" className="mt-4">
          <OutletOrderCreate />
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
        <TabsContent value="itemlist" className="mt-4">
          <OutletItemsList />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <OutletCategoryManager />
        </TabsContent>
        <TabsContent value="inventory" className="mt-4">
          <OutletInventory />
        </TabsContent>
        <TabsContent value="rules" className="mt-4">
          <CrossOrderingRules />
        </TabsContent>
      </Tabs>
    </div>
  );
}
