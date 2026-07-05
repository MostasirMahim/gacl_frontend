"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Plus,
  UserPlus,
  KeyRound,
  SquarePen,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddPermissionForm } from "@/components/groups/AddPermit";
import { AddMemberForm } from "@/components/groups/AddUserGP";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { LoadingDots } from "@/components/ui/loading";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { BRAND_CONFIG } from "@/config/brand";

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [addPermissionDialogOpen, setAddPermissionDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"member" | "permission">(
    "member"
  );

  const [deleteTarget, setDeleteTarget] = useState<{
    id?: number;
    name: string;
  } | null>(null);

  const { data: GROUP, isLoading } = useQuery({
    queryKey: ["getGroup", id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/account/v1/authorization/groups/${id}/`
        );
        if (res?.data?.status === "success") {
          return res.data.data;
        } else {
          console.error("Failed to fetch group:", res.data.message);
          toast.error(res?.data?.message);
          return null;
        }
      } catch (error: any) {
        console.error("Error fetching group stats:", error);
        toast.error(error?.response?.data?.message);
        return null;
      }
    },
  });

  const groupName = GROUP?.group?.name || "";
  const isSystemGroup = groupName === "super_admin" || groupName === "club_member";
  const isClubMemberGroup = groupName === "club_member";

  const { mutate: updateGroup, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.patch(
        `/api/account/v2/authorization/group_permissions/${id}/`,
        userData
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["getGroup", id] }),
          queryClient.invalidateQueries({ queryKey: ["getGroups"] }),
        ]);

        router.refresh();
        toast.success("Group Updated Successfully");
        formik.resetForm();
        setUpdateDialogOpen(false);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : messages
          );
        });
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "Group Update Failed");
      } else {
        toast.error(detail || message || "Group Update Failed");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      name: groupName,
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors: { name?: string } = {};
      if (!values.name.trim()) {
        errors.name = "Group name is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      if (isSystemGroup) {
        toast.warning("System group names cannot be renamed as they are required by backend permission checks.");
        return;
      }
      updateGroup(values);
    },
  });

  const { mutate: removeUser, isPending: removePending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.delete(
        "/api/account/v1/authorization/assign_group_user/",
        { data }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getGroup", id] });
        toast.success("Users Removed Successfully");
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "Users Removal Failed");
      } else {
        toast.error(detail || message || "Users Removal Failed");
      }
    },
  });

  const { mutate: removePermit, isPending: removePermitPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.delete(
        `/api/account/v1/authorization/group_permissions/`,
        { data }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getGroup", id] });
        toast.success("Permission Removed Successfully");
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "Permission Removal Failed");
      } else {
        toast.error(detail || message || "Permission Removal Failed");
      }
    },
  });

  const handleDeleteMember = (member: any) => {
    setDeleteType("member");
    setDeleteTarget({ id: member.id, name: member.username });
    setDeleteDialogOpen(true);
  };

  const handleDeletePermission = (permission: any) => {
    setDeleteType("permission");
    setDeleteTarget({ name: permission.name, id: permission.id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      toast.error("Please select a member or permission to delete.");
      return;
    }

    if (deleteType === "member" && deleteTarget.id) {
      removeUser({ user_id: deleteTarget.id, group_id: parseInt(id) });
    } else if (deleteType === "permission" && deleteTarget.id) {
      removePermit({ permission: deleteTarget.id, group: parseInt(id) });
    }
  };

  const handleEditClick = () => {
    if (isSystemGroup) {
      toast.warning(`System group '${groupName}' cannot be renamed as it is tied to system permission rules.`);
      return;
    }
    setUpdateDialogOpen(true);
  };

  if (isLoading || removePending || removePermitPending) return <LoadingDots />;

  if (!GROUP) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Group Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The group you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/groups")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex justify-start items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {groupName || "Group Name"}
            </h1>
            {!isSystemGroup ? (
              <SquarePen
                onClick={handleEditClick}
                className="h-4 w-4 cursor-pointer hover:text-primary hover:scale-110 hover:-translate-y-1 transition-transform duration-200"
              />
            ) : (
              <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-500 bg-amber-500/10">
                System Protected Group
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Special Info Notice Card for club_member vs standard Users card */}
        {isClubMemberGroup ? (
          <Card className="h-fit border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <UserCheck className="w-6 h-6" />
                Member Authorization Policy Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <div className="p-3 rounded-lg bg-background/80 border border-emerald-500/20 text-foreground space-y-2">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Dedicated Member Permission Group
                </p>
                <p>
                  All registered, non-staff club members automatically inherit the self-service capabilities assigned to this group by default.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">{BRAND_CONFIG.portalName} Capabilities Included:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs font-medium text-foreground/80">
                  <li>Member Profile View (<code className="bg-muted px-1 py-0.5 rounded">member:view</code>)</li>
                  <li>Invoices & Payment Processing (<code className="bg-muted px-1 py-0.5 rounded">member_financial:view_invoices</code>)</li>
                  <li>Restaurant Menu & Ordering (<code className="bg-muted px-1 py-0.5 rounded">restaurant:order_create</code>)</li>
                  <li>Beverage Outlet Orders (<code className="bg-muted px-1 py-0.5 rounded">outlet:order_create</code>)</li>
                  <li>Resource & Court Reservations (<code className="bg-muted px-1 py-0.5 rounded">reservation:create</code>)</li>
                  <li>Club Events & Check-in Logs (<code className="bg-muted px-1 py-0.5 rounded">event:view</code>)</li>
                </ul>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium pt-2 border-t border-emerald-500/20">
                ⚠️ Be cautious when updating permissions in this right-hand list. Modifications directly control what all active club members can browse and perform across the application.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Users: {GROUP?.users?.length}
                </CardTitle>
                <Button size="sm" onClick={() => setAddMemberDialogOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[450px] overflow-y-auto">
              {GROUP?.users?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No members in this group</p>
                </div>
              ) : (
                GROUP?.users?.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">
                        {member.first_name + " " + member.last_name}{" "}
                        <span className="font-normal text-sm italic">
                          {member.username}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs mt-1">
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {member.is_staff ? "Staff" : "User"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMember(member)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Permissions: {GROUP?.permissions?.length}
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setAddPermissionDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[450px] overflow-y-auto">
            {GROUP?.permissions?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <KeyRound className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No permissions assigned</p>
              </div>
            ) : (
              GROUP?.permissions?.map((permission: any) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="font-mono text-sm">{permission.name}</div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePermission(permission)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the{" "}
              {deleteType}{" "}
              <span className="font-semibold">"{deleteTarget?.name}"</span> from
              this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {deleteType === "member" ? "Member" : "Permission"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-fit">
          <DialogHeader>
            <DialogTitle>
              Add users to {groupName || "Group"}
            </DialogTitle>
          </DialogHeader>
          <AddMemberForm
            groupId={id}
            onCancel={() => setAddMemberDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={addPermissionDialogOpen}
        onOpenChange={setAddPermissionDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Permissions to Group</DialogTitle>
          </DialogHeader>
          <AddPermissionForm
            existingPermissions={GROUP?.permissions || []}
            groupId={id}
            onCancel={() => setAddPermissionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Group</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-2 sm:space-y-3"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSystemGroup}
                placeholder="Enter group name"
                className={
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }
              />
              {isSystemGroup && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  System protected group names cannot be modified.
                </p>
              )}
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500">
                  {formik.errors.name as string}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  formik.resetForm();
                  setUpdateDialogOpen(false);
                }}
                className="w-full sm:w-auto bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isSystemGroup}
                className="w-full sm:w-auto"
              >
                {isPending ? "Updating..." : "Update Group"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
