"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import useGetAllEvents from "@/hooks/data/useGetAllEvents";

const KINDS = ["food", "logistics", "talent", "decoration", "marketing", "other"];

function EventExpenseForm() {
  const { data: eventsData } = useGetAllEvents();
  const events = eventsData?.data || eventsData?.results || [];
  const queryClient = useQueryClient();

  const [eventId, setEventId] = useState("");
  const [kind, setKind] = useState("food");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profit, setProfit] = useState<any>(null);

  async function submit() {
    if (!eventId || !title) {
      toast.error("Pick an event and give the expense a title");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post("/api/event/v1/events/expenses/", {
        event: Number(eventId),
        kind,
        title,
        description,
        quantity,
        unit_cost: unitCost,
        amount: quantity * unitCost,
      });
      toast.success("Expense recorded");
      setTitle("");
      setDescription("");
      setQuantity(1);
      setUnitCost(0);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to record expense");
    } finally {
      setLoading(false);
    }
  }

  async function loadProfit() {
    if (!eventId) {
      toast.error("Pick an event first");
      return;
    }
    try {
      const res = await axiosInstance.get(
        `/api/event/v1/events/${eventId}/profitability/`
      );
      setProfit(res?.data?.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load profitability");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Event Cost Tracking</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Event</label>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
            <SelectContent>
              {events.map((e: any) => (
                <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Kind</label>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {KINDS.map((k) => (
                  <SelectItem key={k} value={k} className="capitalize">{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <Input type="number" value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Unit Cost</label>
            <Input type="number" value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Total</label>
            <Input disabled value={quantity * unitCost} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={submit} disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Record Expense"}
          </Button>
          <Button variant="outline" onClick={loadProfit} className="flex-1">
            View Profitability
          </Button>
        </div>

        {profit && (
          <div className="rounded-md bg-muted p-4 text-sm space-y-1">
            <p className="font-medium">{profit.title}</p>
            <p>Ticket income: BDT {profit.ticket_income}</p>
            <p>Total expense: BDT {profit.total_expense}</p>
            <p className="font-semibold">Net: BDT {profit.net}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventExpenseForm;
