"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Wine,
  CalendarClock,
  ReceiptText,
  ClipboardList,
  LogOut,
  User,
  Menu,
  History,
} from "lucide-react";

const NAV = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/events", label: "Events", icon: CalendarClock },
  { href: "/portal/order/restaurant", label: "Order Food", icon: UtensilsCrossed },
  { href: "/portal/order/outlet", label: "Bar & Lounge", icon: Wine },
  { href: "/portal/reservations", label: "Reservations", icon: CalendarClock },
  { href: "/portal/orders", label: "My Orders", icon: ClipboardList },
  { href: "/portal/bills", label: "My Bills", icon: ReceiptText },
  { href: "/portal/profile", label: "My Profile", icon: User },
  { href: "/portal/activity", label: "Activity Logs", icon: History },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { memberName, memberID } = usePermissions();
  const [sheetOpen, setSheetOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
                  <div className="p-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold">
                        SC
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">Saint Club</p>
                        <p className="text-xs text-muted-foreground">Member Portal</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                    {NAV.map((item) => {
                      const active = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
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
                  </div>
                  <div className="p-4 border-t border-border/60">
                    <Button variant="outline" className="w-full gap-2 justify-start" onClick={logout}>
                      <LogOut className="w-4 h-4" /> Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop & Mobile Logo (Left) */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary hidden md:grid place-items-center font-bold">
                SC
              </div>
              <div className="flex flex-col">
                <p className="font-semibold leading-tight text-sm md:text-base">Saint Club</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Member Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Desktop Avatar Menu on Right */}
            <div className="hidden md:flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                    <Avatar className="w-10 h-10 border border-border hover:opacity-80 transition-opacity">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {memberName ? memberName[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal flex gap-3 p-3">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {memberName ? memberName[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none line-clamp-1">{memberName || "Member"}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {memberID || "N/A"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/portal/profile" className="w-full cursor-pointer flex items-center gap-2">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer flex items-center gap-2" onClick={logout}>
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Side nav (Desktop only) */}
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

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
