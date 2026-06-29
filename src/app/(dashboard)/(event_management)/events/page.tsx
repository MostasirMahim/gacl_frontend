"use client";

import React, { useState } from "react";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { EventCard } from "@/components/events/EventCard";
import { EventPagination } from "@/components/events/EventPagination";
import useGetAllEvents from "@/hooks/data/useGetAllEvents";
import { LoadingDots } from "@/components/ui/loading";
import PermissionGuard from "@/components/common/PermissionGuard";

const ITEMS_PER_PAGE = 10;

export default function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: AllEvents, isLoading } = useGetAllEvents();

  const totalPages = Math.ceil(AllEvents?.data?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = AllEvents?.data?.slice(startIndex, endIndex);

  if (isLoading) return <LoadingDots />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
            <p className="text-muted-foreground">
              Browse and manage all your events
            </p>
          </div>
          <PermissionGuard permission="event:create">
            <CreateEventModal />
          </PermissionGuard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentEvents?.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <EventPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
