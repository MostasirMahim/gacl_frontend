"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinanceDashboard from "@/components/finance/FinanceDashboard";
import EventExpenseForm from "@/components/finance/EventExpenseForm";

export default function FinancePage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Finance & Reporting</h1>
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="events">Event Costs</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4">
          <FinanceDashboard />
        </TabsContent>
        <TabsContent value="events" className="mt-4">
          <EventExpenseForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
