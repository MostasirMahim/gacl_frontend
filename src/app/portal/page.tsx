"use client";

import Link from "next/link";
import Image from "next/image";
import { useMyDashboard, useRestaurants } from "@/hooks/data/usePortal";
import { getMediaUrl } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/loading";
import {
  UtensilsCrossed,
  Wine,
  CalendarClock,
  ReceiptText,
  Wallet,
  ClipboardList,
  Store,
  Clock,
  ArrowRight,
} from "lucide-react";

function Stat({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${tone}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}

export default function PortalDashboardPage() {
  const { data, isLoading } = useMyDashboard();
  const { data: restaurants, isLoading: isRestaurantsLoading } = useRestaurants();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome{data?.member_name ? `, ${data.member_name}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Order food & drinks, book facilities, and manage your bills — all in
          one place.
        </p>
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Active Orders"
              value={data?.active_orders ?? 0}
              hint={`${data?.restaurant_orders ?? 0} food · ${
                data?.outlet_orders ?? 0
              } bar/lounge`}
              icon={<ClipboardList className="w-5 h-5" />}
              tone="bg-blue-100 text-blue-700"
            />
            <Stat
              label="Upcoming Reservations"
              value={data?.upcoming_reservations ?? 0}
              hint={`${data?.reservations ?? 0} total`}
              icon={<CalendarClock className="w-5 h-5" />}
              tone="bg-purple-100 text-purple-700"
            />
            <Stat
              label="Unpaid Bills"
              value={data?.unpaid_invoices ?? 0}
              hint={`of ${data?.invoices ?? 0} total`}
              icon={<ReceiptText className="w-5 h-5" />}
              tone="bg-amber-100 text-amber-700"
            />
            <Stat
              label="Outstanding"
              value={`BDT ${data?.outstanding_balance ?? "0"}`}
              hint={`Lifetime spend BDT ${data?.lifetime_spend ?? "0"}`}
              icon={<Wallet className="w-5 h-5" />}
              tone="bg-emerald-100 text-emerald-700"
            />
          </div>

          {/* Explore Restaurants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Explore Our Dining</h2>
                <p className="text-sm text-muted-foreground">Discover exquisite flavors at our premier restaurants</p>
              </div>
            </div>
            
            {isRestaurantsLoading ? (
              <LoadingDots />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {restaurants?.map((restaurant: any) => (
                  <Link key={restaurant.id} href={`/restaurant/${restaurant.slug}/menu`} target="_blank">
                    <Card className="group overflow-hidden border-border/40 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-pointer">
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        {restaurant.banner_bg_image ? (
                          <Image
                            src={getMediaUrl(restaurant.banner_bg_image)}
                            alt={restaurant.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <UtensilsCrossed className="w-12 h-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-semibold text-white line-clamp-1">{restaurant.name}</h3>
                          <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
                            <Store className="w-3 h-3" />
                            <span className="capitalize">{restaurant.status}</span>
                            <span className="mx-1">•</span>
                            <Clock className="w-3 h-3" />
                            <span>
                              {restaurant.opening_time ? restaurant.opening_time.slice(0,5) : "00:00"} - {restaurant.closing_time ? restaurant.closing_time.slice(0,5) : "23:59"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                          {restaurant.description || "Experience the finest culinary delights crafted with passion and served with excellence."}
                        </p>
                        <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary/80 transition-colors mt-auto">
                          View Menu <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-8">
            <h2 className="font-semibold mb-3">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/portal/order/restaurant">
                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <UtensilsCrossed className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold">Order Food</p>
                  <p className="text-sm text-muted-foreground">
                    Browse the restaurant menu and place an order.
                  </p>
                </Card>
              </Link>
              <Link href="/portal/order/outlet">
                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <Wine className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold">Bar & Lounge</p>
                  <p className="text-sm text-muted-foreground">
                    Order from the bar, tea lounge or cigar room.
                  </p>
                </Card>
              </Link>
              <Link href="/portal/reservations">
                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CalendarClock className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold">Book a Facility</p>
                  <p className="text-sm text-muted-foreground">
                    Reserve a card room, pool table or court.
                  </p>
                </Card>
              </Link>
            </div>
          </div>

          {(data?.unpaid_invoices ?? 0) > 0 && (
            <Card className="p-5 border-amber-300 bg-amber-50">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-amber-900">
                    You have {data.unpaid_invoices} unpaid bill
                    {data.unpaid_invoices > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-amber-800">
                    Outstanding balance: BDT {data.outstanding_balance}
                  </p>
                </div>
                <Link href="/portal/bills">
                  <Button>Pay Now</Button>
                </Link>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
