"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorOffersList from "@/components/vendor/VendorOffersList";
import VendorCreateForm from "@/components/vendor/VendorCreateForm";
import VendorPaymentsList from "@/components/vendor/VendorPaymentsList";
import VendorCategoriesList from "@/components/vendor/VendorCategoriesList";

export default function VendorsPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Vendor Management</h1>
      <Tabs defaultValue="offers">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="offers">Offers & Selection</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="create">Add Vendor / Offer</TabsTrigger>
        </TabsList>
        <TabsContent value="offers" className="mt-4">
          <VendorOffersList />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <VendorPaymentsList />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <VendorCategoriesList />
        </TabsContent>
        <TabsContent value="create" className="mt-4">
          <VendorCreateForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
