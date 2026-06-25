"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestaurantCheckoutForm from "@/components/restaurant/RestaurantCheckoutForm";
import RestaurantOrderCreate from "@/components/restaurant/RestaurantOrderCreate";

interface Props {
  memberData: any;
  promoCodeData: any;
}

export default function CheckoutTabs({ memberData, promoCodeData }: Props) {
  return (
    <Tabs defaultValue="order" className="space-y-4">
      <TabsList>
        <TabsTrigger value="order">Place Order (against member)</TabsTrigger>
        <TabsTrigger value="invoice">Quick Invoice (cart)</TabsTrigger>
      </TabsList>
      <TabsContent value="order">
        <RestaurantOrderCreate />
      </TabsContent>
      <TabsContent value="invoice">
        <RestaurantCheckoutForm
          memberData={memberData}
          promoCodeData={promoCodeData}
        />
      </TabsContent>
    </Tabs>
  );
}
