"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/loading";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

export default function PortalEventsPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["portalEvents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/member/v1/portal/events/");
      return res.data?.data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground">
          Browse and register for upcoming club events, tournaments, and gatherings.
        </p>
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : !events || events.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          No upcoming events at the moment.
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => {
            const hasMedia = event.media && event.media.length > 0;
            const imageUrl = hasMedia ? event.media[0].image : null;
            return (
              <Card key={event.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Calendar className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {event.event_type}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span>
                        {event.start_date
                          ? format(new Date(event.start_date), "MMM d, yyyy")
                          : "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary/70" />
                      <span>
                        {event.start_date
                          ? format(new Date(event.start_date), "h:mm a")
                          : "TBA"}
                      </span>
                    </div>
                    {event.venue && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary/70 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">
                          {event.venue.city ? `${event.venue.street_address}, ${event.venue.city}` : event.venue.street_address}
                        </span>
                      </div>
                    )}
                  </div>
                  <Link href={`/portal/events/${event.id}`} className="mt-auto block">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
