import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock } from "lucide-react";

import Link from "next/link";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "default";
      case "ongoing":
        return "destructive";
      case "completed":
        return "secondary";
      case "cancelled":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-balance leading-tight">
            {event.title}
          </CardTitle>
          <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{new Date(event.start_date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {new Date(event.start_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -
              {new Date(event.end_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {event.venue
                ? `${event.venue.city || ""}${
                    event.venue.state_province
                      ? ", " + event.venue.state_province
                      : ""
                  }` || "Venue set"
                : "No venue assigned"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {event.organizer.member_ID}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline">{event.event_type}</Badge>
          <Link href={`/events/views/${event.id}`}>
            <Button variant="default" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
