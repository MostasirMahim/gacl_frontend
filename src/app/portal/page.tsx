"use client";

import Link from "next/link";
import { useMyDashboard } from "@/hooks/data/usePortal";
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

          {/* Quick actions */}
          <div>
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
