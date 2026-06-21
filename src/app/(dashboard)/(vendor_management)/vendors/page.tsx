"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorOffersList from "@/components/vendor/VendorOffersList";
import VendorCreateForm from "@/components/vendor/VendorCreateForm";

export default function VendorsPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Vendor Management</h1>
      <Tabs defaultValue="offers">
        <TabsList>
          <TabsTrigger value="offers">Offers & Selection</TabsTrigger>
          <TabsTrigger value="create">Add Vendor / Offer</TabsTrigger>
        </TabsList>
        <TabsContent value="offers" className="mt-4">
          <VendorOffersList />
        </TabsContent>
        <TabsContent value="create" className="mt-4">
          <VendorCreateForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
