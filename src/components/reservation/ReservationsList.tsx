"use client";
import { useState } from "react";
import useGetReservations from "@/hooks/data/useGetReservations";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const STATUS_VARIANT: Record<string, any> = {
  pending_payment: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
};

function PayDialog({ reservation }: { reservation: any }) {
  const [mode, setMode] = useState("sslcommerz");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function pay() {
    try {
      setLoading(true);
      await axiosInstance.post(
        `/api/reservation/v1/reservations/${reservation.id}/pay-advance/`,
        { payment_mode: mode }
      );
      toast.success("Advance paid — reservation confirmed");
      queryClient.invalidateQueries({ queryKey: ["getReservations"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Pay Advance</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay advance — {reservation.reservation_number}</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Advance due: BDT {reservation.advance_amount}</p>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
            <SelectItem value="pos">POS</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={pay} disabled={loading}>
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function ReservationsList() {
  const [status, setStatus] = useState("");
  const { data, isLoading } = useGetReservations(status ? `?status=${status}` : "");
  const queryClient = useQueryClient();
  const reservations = data?.data || data?.results || [];

  async function cancel(id: number) {
    try {
      await axiosInstance.post(`/api/reservation/v1/reservations/${id}/cancel/`, {});
      toast.success("Reservation cancelled");
      queryClient.invalidateQueries({ queryKey: ["getReservations"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cancel failed");
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reservations</h2>
        <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending_payment">Pending Payment</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <LoadingDots />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reservation #</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Advance</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono">{r.reservation_number}</TableCell>
                <TableCell>{r.resource_name}</TableCell>
                <TableCell>{new Date(r.start_time).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[r.status] || "default"}>{r.status}</Badge>
                </TableCell>
                <TableCell>BDT {r.advance_amount}</TableCell>
                <TableCell className="flex gap-2">
                  {r.status === "pending_payment" && <PayDialog reservation={r} />}
                  {(r.status === "pending_payment" || r.status === "confirmed") && (
                    <Button size="sm" variant="outline" onClick={() => cancel(r.id)}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No reservations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default ReservationsList;
