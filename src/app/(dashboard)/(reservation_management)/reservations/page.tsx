"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "@/components/reservation/BookingForm";
import ReservationsList from "@/components/reservation/ReservationsList";
import ResourceForm from "@/components/reservation/ResourceForm";
import ResourcesList from "@/components/reservation/ResourcesList";

export default function ReservationsPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Reservations</h1>
      <Tabs defaultValue="book">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="book">New Booking</TabsTrigger>
          <TabsTrigger value="list">All Reservations</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="create">Add Resource</TabsTrigger>
        </TabsList>
        <TabsContent value="book" className="mt-4">
          <BookingForm />
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <ReservationsList />
        </TabsContent>
        <TabsContent value="resources" className="mt-4">
          <ResourcesList />
        </TabsContent>
        <TabsContent value="create" className="mt-4">
          <ResourceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
