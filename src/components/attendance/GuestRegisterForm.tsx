"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MemberSelectModal from "@/components/shared/MemberSelectModal";

interface Props {
  membersData?: any;
  staffData?: any;
}

function GuestRegisterForm({ membersData, staffData }: Props) {
  const members = membersData?.data || [];
  const staff = staffData?.data || [];
  const [loading, setLoading] = useState(false);
  const [selectedHostMember, setSelectedHostMember] = useState<any>(null);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      guest_relation: "guest",
      host_type: "member",
      host_member: "",
      host_staff: "",
    },
  });
  const { setError, watch } = form;
  const hostType = watch("host_type");

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      const payload: any = {
        name: values.name,
        phone: values.phone,
        guest_relation: values.guest_relation,
        host_type: values.host_type,
      };
      if (values.host_type === "member") payload.host_member = values.host_member;
      else payload.host_staff = values.host_staff;

      const response = await axiosInstance.post(
        "/api/attendance/v1/attendance/guests/",
        payload
      );
      if (response.status === 201) {
        toast.success("Guest registered successfully");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["getGuests"] });
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        for (const key in errors) {
          if (key !== "non_field_errors") {
            setError(key as any, { type: "server", message: errors[key][0] });
          }
        }
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Register Guest</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Guest full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            rules={{ required: "Phone is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="01XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guest_relation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relation</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="family">Family Member</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="host_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Host type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {hostType === "member" ? (
            <FormField
              control={form.control}
              name="host_member"
              rules={{ required: "Select a host member" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Member</FormLabel>
                  <FormControl>
                    <MemberSelectModal
                      value={
                        selectedHostMember
                          ? {
                              member_ID: selectedHostMember.member_ID,
                              name: selectedHostMember.name,
                            }
                          : null
                      }
                      onSelect={(m) => {
                        setSelectedHostMember(m);
                        field.onChange(String(m.id));
                      }}
                      triggerLabel="Search & select host member"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="host_staff"
              rules={{ required: "Select a host staff" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Staff (guest-allowed only)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staff
                        .filter((s: any) => s.guest_allowed)
                        .map((s: any) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.staff_ID} — {s.designation}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register Guest"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default GuestRegisterForm;
