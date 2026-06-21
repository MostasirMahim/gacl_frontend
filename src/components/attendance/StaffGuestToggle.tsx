"use client";
import useGetStaffProfiles from "@/hooks/data/useGetStaffProfiles";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";

function StaffGuestToggle() {
  const { data, isLoading } = useGetStaffProfiles();
  const queryClient = useQueryClient();
  const staff = data?.data || [];

  async function toggle(id: number, value: boolean) {
    try {
      await axiosInstance.patch(
        `/api/attendance/v1/attendance/staff/${id}/guest-toggle/`,
        { guest_allowed: value }
      );
      toast.success("Guest permission updated");
      queryClient.invalidateQueries({ queryKey: ["getStaffProfiles"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  }

  if (isLoading) return <LoadingDots />;

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Staff Guest Permissions</h2>
      <div className="space-y-3">
        {staff.map((s: any) => (
          <div
            key={s.id}
            className="flex items-center justify-between border-b border-border/40 pb-2"
          >
            <div>
              <p className="font-medium">{s.staff_ID}</p>
              <p className="text-sm text-muted-foreground">{s.designation}</p>
            </div>
            <Switch
              checked={s.guest_allowed}
              onCheckedChange={(v) => toggle(s.id, v)}
            />
          </div>
        ))}
        {staff.length === 0 && (
          <p className="text-sm text-muted-foreground">No staff profiles found.</p>
        )}
      </div>
    </div>
  );
}

export default StaffGuestToggle;
