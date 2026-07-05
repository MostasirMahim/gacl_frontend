"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useMyReservations } from "@/hooks/data/usePortal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingDots } from "@/components/ui/loading";
import { CalendarPlus } from "lucide-react";

const STATUS_TONE: Record<string, any> = {
  pending_payment: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
};

function BookDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState("1");
  const [party, setParty] = useState("1");
  const [saving, setSaving] = useState(false);

  const { data: resData } = useQuery({
    queryKey: ["portalResources"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/api/reservation/v1/reservations/resources/"
      );
      return res?.data;
    },
  });
  const resources = resData?.data || [];

  async function book() {
    if (!resourceId || !date || !startTime)
      return toast.error("Choose resource, date and time");
    setSaving(true);
    try {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(start.getTime() + Number(hours) * 3600 * 1000);
      await axiosInstance.post("/api/reservation/v1/reservations/", {
        resource_id: Number(resourceId),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        party_size: Number(party),
      });
      toast.success("Reservation created. Pay the advance to confirm.");
      setOpen(false);
      setResourceId("");
      setDate("");
      setStartTime("");
      queryClient.invalidateQueries({ queryKey: ["portalReservations"] });
      queryClient.invalidateQueries({ queryKey: ["portalDashboard"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Could not create reservation");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <CalendarPlus className="w-4 h-4" /> Book a Facility
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Reservation</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Facility</label>
            <Select value={resourceId} onValueChange={setResourceId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a facility" />
              </SelectTrigger>
              <SelectContent>
                {resources.map((r: any) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name} — advance BDT {r.advance_amount}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Start time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Hours</label>
              <Input
                type="number"
                min={1}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Party size</label>
              <Input
                type="number"
                min={1}
                value={party}
                onChange={(e) => setParty(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={book} disabled={saving} className="w-full">
            {saving ? "Booking..." : "Create Reservation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayAdvanceButton({ reservation }: { reservation: any }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function pay(mode: string) {
    setLoading(true);
    try {
      await axiosInstance.post(
        `/api/reservation/v1/reservations/${reservation.id}/pay-advance/`,
        { payment_mode: mode }
      );
      toast.success("Advance paid — reservation confirmed!");
      queryClient.invalidateQueries({ queryKey: ["portalReservations"] });
      queryClient.invalidateQueries({ queryKey: ["portalDashboard"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" disabled={loading} onClick={() => pay("sslcommerz")}>
        Pay Online
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => pay("pos")}
      >
        Pay at Club
      </Button>
    </div>
  );
}

export default function MyReservationsPage() {
  const { data: reservations, isLoading } = useMyReservations();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">My Reservations</h1>
        <BookDialog />
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : !reservations || reservations.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          You have no reservations yet.
        </Card>
      ) : (
        <div className="space-y-3">
          {reservations.map((r: any) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold">{r.resource_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(r.start_time).toLocaleString()} —{" "}
                    {new Date(r.end_time).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.reservation_number} · Advance BDT {r.advance_amount}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    variant={STATUS_TONE[r.status] || "default"}
                    className="capitalize"
                  >
                    {String(r.status).replace("_", " ")}
                  </Badge>
                  {r.status === "pending_payment" && (
                    <PayAdvanceButton reservation={r} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
