"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/loading";
import { Calendar, MapPin, Clock, Users, Ticket, Tag } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function PortalEventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [promoCode, setPromoCode] = useState("");
  const [booking, setBooking] = useState(false);

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["portalEventDetails", params.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/event/v1/events/${params.id}/`);
      return res.data?.data;
    },
  });

  const { data: ticketsResponse, isLoading: ticketsLoading } = useQuery({
    queryKey: ["portalEventTickets", params.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/event/v1/events/tickets/?event=${params.id}`);
      return res.data?.data || [];
    },
  });

  const tickets = ticketsResponse || [];

  async function handleBook() {
    if (!selectedTicketId) {
      toast.error("Please select a ticket type first.");
      return;
    }
    setBooking(true);
    try {
      const payload: any = { ticket_id: selectedTicketId };
      if (promoCode) payload.promo_code = promoCode;

      const res = await axiosInstance.post("/api/member/v1/portal/events/buy/", payload);
      toast.success(res.data?.message || "Ticket booked successfully!");
      
      const invoiceId = res.data?.data?.invoice_id;
      if (invoiceId) {
        router.push(`/portal/bills`);
      } else {
        router.push("/portal/events");
      }
      queryClient.invalidateQueries({ queryKey: ["portalInvoices"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to book ticket");
    } finally {
      setBooking(false);
    }
  }

  if (eventLoading || ticketsLoading) {
    return <LoadingDots />;
  }

  if (!event) {
    return (
      <Card className="p-10 text-center text-muted-foreground">
        Event not found.
      </Card>
    );
  }

  const hasMedia = event.media && event.media.length > 0;
  const imageUrl = hasMedia ? event.media[0].image : null;
  const selectedTicket = tickets.find((t: any) => t.id.toString() === selectedTicketId);

  return (
    <div className="space-y-6">
      <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden bg-muted">
        {imageUrl ? (
          <Image src={imageUrl} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Calendar className="w-16 h-16 opacity-20" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="bg-background/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border/50 max-w-2xl w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-md">
                {event.event_type}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                ["planned", "ongoing"].includes(event.status?.toLowerCase()) ? "bg-green-100 text-green-700" :
                event.status?.toLowerCase() === "cancelled" ? "bg-red-100 text-red-700" :
                "bg-amber-100 text-amber-700"
              }`}>
                {event.status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {event.start_date ? format(new Date(event.start_date), "MMM d, yyyy") : "TBA"}
                  {event.end_date ? ` - ${format(new Date(event.end_date), "MMM d, yyyy")}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {event.start_date ? format(new Date(event.start_date), "h:mm a") : "TBA"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">About this Event</h2>
            <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap">
              {event.description}
            </div>
          </Card>

          {event.venue && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{event.venue.city || "Venue"}</p>
                  <p className="text-muted-foreground text-sm">
                    {event.venue.street_address}
                    {event.venue.state_province ? `, ${event.venue.state_province}` : ""}
                    {event.venue.postal_code ? ` - ${event.venue.postal_code}` : ""}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {event.organizer && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">
                    {event.organizer.first_name} {event.organizer.last_name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Member ID: {event.organizer.member_ID}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Book Ticket</h2>
            {(!["planned", "ongoing"].includes(event.status?.toLowerCase()) || (event.registration_deadline && new Date() > new Date(event.registration_deadline))) ? (
              <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-sm">
                {event.registration_deadline && new Date() > new Date(event.registration_deadline) 
                  ? "Registration for this event has closed." 
                  : `This event is currently ${event.status}. Booking is not available.`}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-4 bg-muted text-muted-foreground rounded-lg text-sm text-center">
                No tickets available for this event yet.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Ticket Type</label>
                  <Select value={selectedTicketId} onValueChange={setSelectedTicketId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a ticket..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tickets.map((t: any) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.ticket_name} - BDT {t.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTicket && (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>Price</span>
                      <span>BDT {selectedTicket.price}</span>
                    </div>
                    {selectedTicket.capacity && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Capacity</span>
                        <span>{selectedTicket.capacity} seats</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Promo Code
                  </label>
                  <Input 
                    placeholder="Enter code (optional)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                </div>

                <div className="pt-2 border-t border-border/60">
                  <div className="flex justify-between items-center mb-4 font-bold text-lg">
                    <span>Total</span>
                    <span>BDT {selectedTicket ? selectedTicket.price : "0.00"}</span>
                  </div>
                  <Button 
                    className="w-full gap-2" 
                    size="lg" 
                    onClick={handleBook}
                    disabled={!selectedTicketId || booking}
                  >
                    <Ticket className="w-4 h-4" />
                    {booking ? "Processing..." : "Confirm & Book"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    By booking, an invoice will be generated. You can pay it immediately or charge it to your club account.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
