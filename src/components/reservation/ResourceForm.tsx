"use client";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

function ResourceForm() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
      resource_type: "badminton",
      description: "",
      advance_amount: 0,
      capacity: 1,
      max_per_member: 1,
      slot_minutes: 60,
    },
  });
  const { setError } = form;

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/reservation/v1/reservations/resources/",
        values
      );
      if (res.status === 201) {
        toast.success("Resource created");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["getResources"] });
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        for (const key in errors) {
          if (key !== "non_field_errors")
            setError(key as any, { type: "server", message: errors[key][0] });
        }
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create Reservable Resource</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl><Input placeholder="e.g. Court A" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resource_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="card_room">Card Room</SelectItem>
                    <SelectItem value="pool">Pool</SelectItem>
                    <SelectItem value="badminton">Badminton</SelectItem>
                    <SelectItem value="paddle">Paddle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="advance_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advance Amount (BDT)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slot_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot Length (min)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concurrent Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_per_member"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Bookings / Member</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Resource"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ResourceForm;
