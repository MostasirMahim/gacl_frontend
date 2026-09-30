"use client";

import React, { useState, useMemo } from "react";
import useGetRestaurantOrders from "@/hooks/data/useGetRestaurantOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";
import {
  Search,
  Receipt,
  CreditCard,
  DoorOpen,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function BillDialog({ order }: { order: any }) {
  const [mode, setMode] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  async function bill() {
    try {
      setLoading(true);
      await axiosInstance.post(
        `/api/restaurants/v1/restaurants/orders/${order.id}/bill/`,
        { payment_mode: mode, discount: 0, tax: 0 }
      );
      toast.success(`Order #${order.order_number} billed successfully!`);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getRestaurantOrders"] });
      queryClient.invalidateQueries({ queryKey: ["getKitchenOrders"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Billing failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-7 text-xs font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Bill Order</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Receipt className="w-4 h-4 text-primary" />
            Generate Bill — {order.order_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {/* Order Summary Box */}
          <div className="p-3 bg-muted/40 border border-border/70 rounded-lg space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Customer / Member:</span>
              <span className="font-semibold text-foreground">
                {order.member_name || order.member?.user?.username || "Club Member"}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Location:</span>
              <span className="font-medium text-foreground">
                {order.serve_location === "room"
                  ? `Room ${order.room_number}`
                  : "Dine-In Restaurant"}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground pt-1.5 border-t border-border/50">
              <span className="font-bold text-foreground">Grand Total:</span>
              <span className="font-mono text-sm font-bold text-primary">
                ৳{order.total_amount}
              </span>
            </div>
          </div>

          {/* Payment Method Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Payment Method
            </label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="h-9 text-xs bg-muted/30 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash Payment</SelectItem>
                <SelectItem value="pos">POS Terminal / Card</SelectItem>
                <SelectItem value="due">Charge to Member Due Account</SelectItem>
                <SelectItem value="sslcommerz">Online Payment (SSLCommerz)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            onClick={bill}
            disabled={loading}
            size="sm"
            className="text-xs h-8 bg-primary text-primary-foreground font-semibold"
          >
            {loading ? "Processing..." : "Confirm & Issue Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersList() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const queryParams = useMemo(() => {
    const p = new URLSearchParams();
    if (status) p.append("status", status);
    p.append("page", String(page));
    p.append("page_size", String(pageSize));
    return `?${p.toString()}`;
  }, [status, page, pageSize]);

  const { data, isLoading } = useGetRestaurantOrders(queryParams);
  const queryClient = useQueryClient();

  const rawOrders: any[] = data?.data || data?.results || [];
  const pagination = data?.pagination;
  const totalCount = pagination?.count ?? rawOrders.length;
  const totalPages = pagination?.total_pages ?? Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = pagination?.current_page ?? page;

  const handleStatusChange = (val: string) => {
    setStatus(val === "all" ? "" : val);
    setPage(1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setPage(1);
  };

  // Filter orders by search query
  const filteredOrders = useMemo(() => {
    if (!search.trim()) return rawOrders;
    const q = search.toLowerCase().trim();
    return rawOrders.filter(
      (o) =>
        o.order_number?.toLowerCase().includes(q) ||
        o.member_name?.toLowerCase().includes(q) ||
        o.room_number?.toLowerCase().includes(q) ||
        o.restaurant_name?.toLowerCase().includes(q)
    );
  }, [rawOrders, search]);

  function getStatusBadge(s: string) {
    switch (s) {
      case "billed":
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
            Billed
          </span>
        );
      case "served":
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Served
          </span>
        );
      case "ready":
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Ready
          </span>
        );
      case "preparing":
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-500/10 text-sky-500 border border-sky-500/20">
            Preparing
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Confirmed
          </span>
        );
      case "pending_otp":
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-600 border border-amber-500/25">
            Pending OTP
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground border border-border">
            {s}
          </span>
        );
    }
  }

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="bg-card/75 dark:bg-card/45 border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* ── Filter & Search Toolbar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-muted/40 dark:bg-muted/20 border border-border/70 rounded-xl shadow-2xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, member, room..."
            className="w-full h-8 bg-card border border-border/80 rounded-md pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors font-medium"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="h-8 w-36 text-xs bg-card border-border/80 cursor-pointer">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending_otp">Pending OTP</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="served">Served</SelectItem>
              <SelectItem value="billed">Billed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Limit / Page Size selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
              Page Size:
            </span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-24 text-xs bg-card border-border/80 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
                <SelectItem value="250">250 / page</SelectItem>
                <SelectItem value="500">Show All (500)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["getRestaurantOrders"] })}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Orders Table ─────────────────────────────────────── */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingDots />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="pl-4 py-3">Order #</TableHead>
                  <TableHead className="py-3">Member</TableHead>
                  <TableHead className="py-3">Destination</TableHead>
                  <TableHead className="py-3">Status</TableHead>
                  <TableHead className="py-3">Total Amount</TableHead>
                  <TableHead className="py-3">Placed At</TableHead>
                  <TableHead className="text-right pr-4 py-3">Billing & Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/60 text-xs">
                {filteredOrders.map((o: any) => (
                  <TableRow
                    key={o.id}
                    className="hover:bg-muted/40 transition-colors cursor-default"
                  >
                    <TableCell className="pl-4 py-3 font-mono font-bold text-foreground">
                      {o.order_number}
                    </TableCell>

                    <TableCell className="py-3 font-medium text-foreground">
                      {o.member_name || o.member?.user?.username || "—"}
                    </TableCell>

                    <TableCell className="py-3 whitespace-nowrap">
                      {o.serve_location === "room" ? (
                        <span className="inline-flex items-center gap-1 text-sky-500 font-semibold bg-sky-500/10 px-2 py-0.5 rounded text-[11px]">
                          <DoorOpen className="w-3 h-3" />
                          Room {o.room_number || "—"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded text-[11px]">
                          <UtensilsCrossed className="w-3 h-3 text-primary/70" />
                          Dine-in
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-3 whitespace-nowrap">
                      {getStatusBadge(o.status)}
                    </TableCell>

                    <TableCell className="py-3 font-mono font-bold text-foreground whitespace-nowrap">
                      ৳{o.total_amount}
                    </TableCell>

                    <TableCell className="py-3 text-muted-foreground whitespace-nowrap text-[11px]">
                      {new Date(o.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    <TableCell className="text-right pr-4 py-3 whitespace-nowrap">
                      {(o.status === "served" || o.status === "ready") && (
                        <BillDialog order={o} />
                      )}
                      {o.status === "billed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-xs text-muted-foreground"
                    >
                      <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                      No orders found matching the filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ── Pagination Footer Controls ───────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs">
        <div className="text-muted-foreground font-medium">
          Showing <span className="font-semibold text-foreground">{startRecord}</span> to{" "}
          <span className="font-semibold text-foreground">{endRecord}</span> of{" "}
          <span className="font-semibold text-foreground">{totalCount}</span> total orders
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || isLoading}
            className="h-8 px-2.5 text-xs font-medium border-border/80 gap-1 cursor-pointer disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </Button>

          <div className="flex items-center gap-1 px-2">
            <span className="font-medium text-muted-foreground">Page</span>
            <span className="font-bold text-foreground">{currentPage}</span>
            <span className="text-muted-foreground">of</span>
            <span className="font-bold text-foreground">{totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || isLoading}
            className="h-8 px-2.5 text-xs font-medium border-border/80 gap-1 cursor-pointer disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
