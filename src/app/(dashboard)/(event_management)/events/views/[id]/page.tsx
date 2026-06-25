import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  User,
  Clock,
  AlertCircle,
  Tag,
  Image,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import MasonryGrid from "@/components/events/MasonryGrid";

interface EventDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  if (!authToken) {
    return notFound();
  }
  let event = null;
  try {
    const { data } = await axiosInstance.get(
      `/api/event/v1/events/${params.id}/`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    event = data.data;
  } catch (error: any) {
    console.error(`Failed to fetch invoice ID: ${params.id}`, error);
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          `Request failed with status code ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message || "Failed to fetch invoice");
    }
  }
  if (!event) {
    notFound();
  }
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
    <div className="min-h-screen">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl text-balance leading-tight">
                    {event.title}
                  </CardTitle>
                  <Badge
                    variant={getStatusColor(event.status)}
                    className="text-sm"
                  >
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground text-pretty">
                    {event.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Start Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.start_date).toLocaleDateString()} at{" "}
                          {new Date(event.start_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">End Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.end_date).toLocaleDateString()} at{" "}
                          {new Date(event.end_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Registration Deadline</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            event.registration_deadline
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            event.registration_deadline
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Event Type</p>
                        <Badge variant="outline">{event.event_type}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Venue Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.venue ? (
                    <>
                      <p className="font-medium">{event.venue.street_address}</p>
                      <p className="text-muted-foreground">
                        {event.venue.city}, {event.venue.state_province}{" "}
                        {event.venue.postal_code}
                      </p>
                      <p className="text-muted-foreground">{event.venue.country}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No venue assigned</p>
                  )}
                  <Badge
                    variant={event.venue?.is_active ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {event.venue?.is_active ? "Active Venue" : "Inactive Venue"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{event.organizer.member_ID}</p>
                    <p className="text-sm text-muted-foreground">
                      Event Organizer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Reminder Set For</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.reminder_time).toLocaleDateString()} at{" "}
                    {new Date(event.reminder_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Event Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MasonryGrid items={event?.media} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
