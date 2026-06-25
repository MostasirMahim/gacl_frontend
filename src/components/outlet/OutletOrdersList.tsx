"use client";
import { useState } from "react";
import useGetOutletOrders from "@/hooks/data/useGetOutletOrders";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";

function BillDialog({ order }: { order: any }) {
  const [mode, setMode] = useState("cash");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function bill() {
    try {
      setLoading(true);
      await axiosInstance.post(
        `/api/outlet/v1/outlets/orders/${order.id}/bill/`,
        { payment_mode: mode, discount: 0, tax: 0 }
      );
      toast.success("Order billed");
      queryClient.invalidateQueries({ queryKey: ["getOutletOrders"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Billing failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Bill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bill order {order.order_number}</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Total: BDT {order.total_amount}</p>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="pos">POS</SelectItem>
            <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
            <SelectItem value="due">Due</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={bill} disabled={loading}>
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function VerifyOtpButton({ order }: { order: any }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function verify() {
    try {
      setLoading(true);
      await axiosInstance.post(
        `/api/outlet/v1/outlets/orders/${order.id}/verify-otp/`,
        { otp_code: code }
      );
      toast.success("Order confirmed");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getOutletOrders"] });
      queryClient.invalidateQueries({ queryKey: ["getOutletKitchen"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Verify OTP
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify OTP — {order.order_number}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter OTP code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={verify} disabled={loading}>
          {loading ? "Verifying..." : "Confirm"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function OutletOrdersList() {
  const [status, setStatus] = useState("");
  const { data, isLoading } = useGetOutletOrders(status ? `?status=${status}` : "");
  const orders = data?.data || data?.results || [];

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Outlet Orders</h2>
        <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending_otp">Pending OTP</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="served">Served</SelectItem>
            <SelectItem value="billed">Billed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <LoadingDots />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o: any) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono">{o.order_number}</TableCell>
                <TableCell><Badge variant="outline">{o.status}</Badge></TableCell>
                <TableCell>{o.room_number || "—"}</TableCell>
                <TableCell>BDT {o.total_amount}</TableCell>
                <TableCell>
                  {(o.status === "served" || o.status === "ready") && <BillDialog order={o} />}
                  {o.status === "pending_otp" && <VerifyOtpButton order={o} />}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default OutletOrdersList;
