"use client";
import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Users,
  RefreshCcwIcon,
  ShieldMinus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingDots } from "@/components/ui/loading";
import { Card } from "../ui/card";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import CustomAlertDialog from "../ui/custom-alert";
import { SmartPagination } from "../utils/SmartPagination";
import useGetAllDeletedList from "@/hooks/data/useGetAllDeletedList";


function RecycleBin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const {
    data: allMembersReq,
    isLoading: user_isLoading,
    refetch,
    isFetching,
  } = useGetAllDeletedList();
  const allMembers = allMembersReq?.data || [];
  const paginationData = allMembersReq?.pagination || {};


  const { mutate: deleteSingleMember, isPending } = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await axiosInstance.delete(
        `/api/member/v1/members/hard_delete/${memberId}/`
      );
      if (res.status === 204) {
        toast.success("Member deleted successfully");
        refetch();
        setDeleteDialogOpen(false);
        setSelectedMemberId(null);
      }
      return res.data;
    },

    onError: (error: any) => {
      console.log("error", error?.response);
       const { message, errors, detail } = error?.response?.data;
      if (errors) {
        if (errors && typeof errors === "object") {
          Object.entries(errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              toast.error(messages[0]);
            }
          });
        }
      } else {
        toast.error(detail || message || "Member Delete Failed");
      }
       refetch();
        setDeleteDialogOpen(false);
        setSelectedMemberId(null);
    },
  });

  const { mutate: deleteBulkMember, isPending: isBulkPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/api/member/v1/members/bulk_delete/all/`
      );
      if (res.status === 204) {
        toast.success("Recycled members deleted successfully");
        refetch();
        setBulkDialogOpen(false);
        setSelectedMemberId(null);
      }
      return res.data;
    },

    onError: (error: any) => {
      console.log("error", error?.response);
      toast.error(`${error?.response?.data?.message}`);
      refetch();
      setBulkDialogOpen(false);
    },
  });

  const handleDelete = (member_ID: string) => {
    deleteSingleMember(member_ID);
  };
  const resetRetry = () => {
    setSearchQuery("");
    setTimeout(() => refetch(), 0);
  };

  const filteredUsers =
    allMembers?.filter((user: any) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
        
      return matchesSearch;
    }) || [];

  const handleMemberClick = (member_ID: string) => {
    console.log("Clicked member ID:", member_ID);
  };

  if (user_isLoading) return <LoadingDots />;
  return (
    <div>
    <div className={`space-y-6 ${bulkDialogOpen ? "bg-gradient-to-b from-red-300 to-red-200 rounded-lg p-2 animate-pulse" : ""}`}>
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recycle Bin</h1>
          <p className="text-muted-foreground">
            A list of all of the recycled members in the system.
          </p>
        </div>

        <div>
          <Button variant={"destructive"} className="gap-1"  onClick={() =>setBulkDialogOpen(true)}>
           <ShieldMinus className="h-4 w-4" />
            Clear Recycle Bin
          </Button>
        </div>
      </div>
      <div
        className={`w-full`}
      >
        <div className="flex gap-2 ">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Members..."
              className="pl-10 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="gap-2 h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <RefreshCcwIcon
              className={`h-4 w-4 ${isFetching && "animate-spin"}`}
            />
            Refresh
          </Button>
        </div>
      </div>
      <div className="rounded-md border my-2 font-secondary">
        <Table>
          <TableHeader>
            <TableRow className="text-center font-bold h-14 bg-primary/20 border-b-2 border-primary dark:bg-accent">
              <TableHead className="font-bold text-center">ID</TableHead>
              <TableHead className="font-bold">Member</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Batch</TableHead>
              <TableHead className="font-bold text-center">
                Martial St.
              </TableHead>
              <TableHead className="font-bold text-center">DOB</TableHead>
              <TableHead className="font-bold">Blood Group</TableHead>
              <TableHead className="font-bold ">Nationality</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-red-500 font-medium"
                >
                  <Card className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          No Members Found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          No members match your current filter criteria. Try
                          adjusting your filters or reset to see all members.
                        </p>
                      </div>
                      <Button
                        onClick={resetRetry}
                        variant="outline"
                        className="gap-2 bg-transparent text-green-600"
                      >
                        <RefreshCcwIcon
                          className={`h-4 w-4 ${isFetching && "animate-spin"}`}
                        />
                        {isFetching ? "Refreshing.." : "Refresh"}
                      </Button>
                    </div>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: any) => (
                <TableRow
                  key={user.id}
                  className="  cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out bg-background "
                >
                  <TableCell
                    className="font-medium "
                    onClick={() => handleMemberClick(user.id)}
                  >
                    {user.id}
                  </TableCell>
                  <TableCell
                    className="flex justify-start items-center"
                    onClick={() => handleMemberClick(user.id)}
                  >
                    <div className="space-y-1 ">
                      <p className="font-medium text-left">
                        {user.first_name + " " + user.id}
                      </p>
                      <p className="text-xs text-muted-foreground text-left">
                        {user.institute_name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    <p>{user.membership_type}</p>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    <Badge
                      variant={"default"}
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      {user.membership_status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    {user.batch_number || "-"}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    {user.marital_status || "-"}
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    {user.date_of_birth || "-"}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    {user.blood_group || "-"}
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.member_ID)}>
                    {user.nationality || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteDialogOpen(true);
                            setSelectedMemberId(user.id);
                          }}
                          className="text-destructive gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center">
        <SmartPagination paginationData={paginationData} />
      </div>
    </div>
     <CustomAlertDialog
        open={deleteDialogOpen}
        title="Are you sure?"
        description={`Do you want to delete member - ${selectedMemberId}?`}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedMemberId) handleDelete(selectedMemberId);
        }}
        confirmText={isPending ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />
      <CustomAlertDialog
        open={bulkDialogOpen}
        title="Are you sure?"
        description={`Are you sure you want to permanently delete all recycled members?`}
        onCancel={() => setBulkDialogOpen(false)}
        onConfirm={() => {
            deleteBulkMember();
        }}
        confirmText={isBulkPending ? "Deleting..." : "Delete All"}
        cancelText="Cancel"
      />
    </div>
  );
}

export default RecycleBin;
