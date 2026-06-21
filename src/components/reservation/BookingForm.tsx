"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import useGetResources from "@/hooks/data/useGetResources";
import useGetAllMembers from "@/hooks/data/useGetAllMembers";
import { CalendarClock } from "lucide-react";

function BookingForm() {
  const { data: resourcesData } = useGetResources();
  const { data: membersData } = useGetAllMembers();
  const queryClient = useQueryClient();
  const resources = resourcesData?.data || [];
  const members = membersData?.data || [];

  const [resourceId, setResourceId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState("");
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function toIso(local: string) {
    // datetime-local has no timezone; convert to ISO
    return local ? new Date(local).toISOString() : "";
  }

  async function checkAvailability() {
    if (!resourceId || !start || !end) {
      toast.error("Pick a resource and a time range first");
      return;
    }
    try {
      const params = new URLSearchParams({
        resource_id: resourceId,
        start_time: toIso(start),
        end_time: toIso(end),
      });
      const res = await axiosInstance.get(
        `/api/reservation/v1/reservations/availability/?${params.toString()}`
      );
      setAvailability(res?.data?.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Availability check failed");
    }
  }

  async function book() {
    if (!resourceId || !memberId || !start || !end) {
      toast.error("Fill resource, member and time range");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/reservation/v1/reservations/", {
        resource_id: Number(resourceId),
        member_id: Number(memberId),
        start_time: toIso(start),
        end_time: toIso(end),
        party_size: partySize,
        note,
      });
      if (res.status === 201) {
        const r = res.data?.data;
        toast.success(
          r?.status === "pending_payment"
            ? "Reservation created — advance payment required"
            : "Reservation confirmed"
        );
        queryClient.invalidateQueries({ queryKey: ["getReservations"] });
        setAvailability(null);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">New Reservation</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Resource</label>
          <Select value={resourceId} onValueChange={setResourceId}>
            <SelectTrigger><SelectValue placeholder="Select resource" /></SelectTrigger>
            <SelectContent>
              {resources.map((r: any) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name} ({r.resource_type.replace("_", " ")}) — adv BDT {r.advance_amount}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Member</label>
          <Select value={memberId} onValueChange={setMemberId}>
            <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
            <SelectContent>
              {members.map((m: any) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.first_name || m.member_ID || `Member ${m.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start</label>
            <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">End</label>
            <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Party Size</label>
            <Input type="number" min={1} value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Note</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        {availability && (
          <div className="rounded-md bg-muted p-3 text-sm flex items-center gap-2">
            <Badge variant={availability.is_available ? "default" : "destructive"}>
              {availability.is_available ? "Available" : "Full"}
            </Badge>
            <span>
              {availability.available} of {availability.capacity} slots free
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={checkAvailability} className="flex-1">
            Check Availability
          </Button>
          <Button onClick={book} disabled={loading} className="flex-1">
            {loading ? "Booking..." : "Create Reservation"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
