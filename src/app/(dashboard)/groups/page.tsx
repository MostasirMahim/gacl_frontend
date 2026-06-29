"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Trash2, Shield, User, ShieldCheckIcon, Crown, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { CreateGroupForm } from "@/components/groups/CreateGroupForms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

import useGetGroups from "@/hooks/data/useGetGroups";
import { LoadingDots } from "@/components/ui/loading";
import { toast } from "react-toastify";

type GroupType = {
  id: number;
  name: string;
};

export default function GroupsPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const queryClient = useQueryClient();
  const { data: GROUPS, isLoading } = useGetGroups();

  const { mutate: removeGroup, isPending: removePending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(
        `/api/account/v1/authorization/group_permissions/${id}/`
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getGroups"] });
        toast.success("Group Removed Successfully");
        setDeleteDialogOpen(false);
        setSelectedGroup(null);
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "Group Removal Failed");
      } else {
        toast.error(detail || message || "Group Removal Failed");
      }
    },
  });

  const handleView = (groupId: number) => {
    router.push(`/groups/${groupId}`);
  };

  const handleDeleteClick = (group: any) => {
    if (group.name === "super_admin" || group.name === "club_member") {
      toast.warning(
        `Sensitive system group '${group.name}' cannot be deleted from the UI as it is required for core system stability.`
      );
      return;
    }
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedGroup) {
      removeGroup(selectedGroup.id);
    }
  };

  const getGroupIcon = (groupName: string) => {
    if (groupName === "super_admin") {
      return <Crown className="w-6 h-6 text-amber-500 animate-pulse" />;
    }
    if (groupName === "club_member") {
      return <UserCheck className="w-6 h-6 text-emerald-500" />;
    }
    return <Shield className="w-5 h-5 text-muted-foreground" />;
  };

  if (isLoading || removePending) return <LoadingDots />;

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">View All Groups</h1>
          <p className="text-muted-foreground">
            Manage user groups and their permissions
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GROUPS?.map((group: any) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  {group.name}
                </CardTitle>
                {getGroupIcon(group.name)}
              </div>
              <Badge variant="secondary" className="w-fit">
                ID: {group.id}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3 my-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Total member: {group.user_count}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Total Permissions: {group?.permission_count}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(group.id)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleDeleteClick({ name: group.name, id: group.id })
                }
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {GROUPS?.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first group to get started
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              group{" "}
              <span className="font-semibold">"{selectedGroup?.name}"</span> and
              remove all associated permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create A Group</DialogTitle>
          </DialogHeader>
          <CreateGroupForm onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
