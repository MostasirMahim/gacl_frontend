"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestaurantCheckoutForm from "@/components/restaurant/RestaurantCheckoutForm";
import RestaurantOrderCreate from "@/components/restaurant/RestaurantOrderCreate";
import { UtensilsCrossed, Receipt, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";

interface Props {
  memberData: any;
  promoCodeData: any;
}

export default function CheckoutTabs({ memberData, promoCodeData }: Props) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="order" className="space-y-6">
        <PageHeader
          title="Touch POS & Order Terminal"
          subtitle="Rapid order entry with kitchen ticket routing and member account billing."
          breadcrumbs={[
            { label: "Restaurants", href: "/restaurants" },
            { label: "POS & Checkout" },
          ]}
          icon={UtensilsCrossed}
          actions={
            <div className="flex items-center gap-2">
              <TabsList className="bg-muted/60 p-1 border border-border/50 h-9">
                <TabsTrigger
                  value="order"
                  className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-primary" /> Touch POS (KOT)
                </TabsTrigger>
                <TabsTrigger
                  value="invoice"
                  className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5 text-blue-500" /> Member Invoice (Cart)
                </TabsTrigger>
              </TabsList>
              <Link href="/restaurant-orders">
                <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 font-medium">
                  <Store className="w-3.5 h-3.5 text-amber-500" /> Kitchen Board
                </Button>
              </Link>
            </div>
          }
        />

        <TabsContent value="order" className="m-0 focus-visible:outline-none">
          <RestaurantOrderCreate />
        </TabsContent>
        <TabsContent value="invoice" className="m-0 focus-visible:outline-none">
          <RestaurantCheckoutForm
            memberData={memberData}
            promoCodeData={promoCodeData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
