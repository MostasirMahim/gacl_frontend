"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Wine,
  CalendarClock,
  ReceiptText,
  ClipboardList,
  LogOut,
  User,
} from "lucide-react";

const NAV = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/order/restaurant", label: "Order Food", icon: UtensilsCrossed },
  { href: "/portal/order/outlet", label: "Bar & Lounge", icon: Wine },
  { href: "/portal/reservations", label: "Reservations", icon: CalendarClock },
  { href: "/portal/orders", label: "My Orders", icon: ClipboardList },
  { href: "/portal/bills", label: "My Bills", icon: ReceiptText },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { memberName, memberID } = usePermissions();

  async function logout() {
    try {
      await axiosInstance.delete("/api/account/v1/logout/");
    } catch {
      // ignore
    }
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-card border-b border-border/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold">
              SC
            </div>
            <div>
              <p className="font-semibold leading-tight">Saint Club</p>
              <p className="text-xs text-muted-foreground">Member Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{memberName || "Member"}</span>
              {memberID && (
                <span className="text-muted-foreground">({memberID})</span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Side nav */}
        <nav className="hidden md:flex flex-col gap-1 h-fit sticky top-24">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-foreground/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile nav */}
        <nav className="md:hidden flex gap-2 overflow-x-auto pb-2">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
