"use client";
import { useState } from "react";
import { RefreshCcwIcon, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card } from "@/components/ui/card";
import useGetAllUsers from "@/hooks/data/useGetAllUsers";
import { formatPostDate } from "@/lib/date_modify";
import { SmartPagination } from "@/components/utils/SmartPagination";

function page() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading: isLoadinAllUsers, refetch, isFetching } = useGetAllUsers();
  const paginationData = data?.pagination;

  const filteredUsers =
    data?.data?.filter((user: any) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  const handleMemberClick = (member_ID: string) => {
    console.log("Member ID clicked:", member_ID);
  };

  if (isLoadinAllUsers) return <LoadingDots />;
  return (
    <div className="space-y-6 ">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ALL Users</h1>
          <p className="text-muted-foreground">
            A list of all users in the system.
          </p>
        </div>
      </div>
      <div className={`w-full`}>
        <div className="flex gap-2 ">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Users..."
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
        <Table className="">
          <TableHeader>
            <TableRow className=" text-center font-bold h-14 bg-primary/20 border-b-2 border-primary dark:bg-accent">
              <TableHead className="font-bold  text-center">ID</TableHead>
              <TableHead className="font-bold">Username</TableHead>
              <TableHead className="font-bold">First Name</TableHead>
              <TableHead className="font-bold">Last Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold text-center">Staff</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="font-bold">Joined At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-red-500 font-medium"
                >
                  <Card className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">No Users Found</h3>
                        <p className="text-sm text-muted-foreground">
                          No users match your current filter criteria.Try
                          adjusting your filters or reset to see all users.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSearchQuery(""), refetch();
                        }}
                        variant="outline"
                        className="gap-2 bg-transparent text-green-600"
                      >
                        <Search className="h-4 w-4" />
                        Retry
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
                  <TableCell onClick={() => handleMemberClick(user.id)}>
                    <p className="font-medium text-left">{user.username}</p>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.id)}>
                    <p className="font-medium text-left">{user.first_name}</p>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.id)}>
                    <p className="font-medium text-left">
                      {user.last_name || "-"}
                    </p>
                  </TableCell>
                  <TableCell onClick={() => handleMemberClick(user.id)}>
                    <p className="font-medium text-left">{user.email}</p>
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => handleMemberClick(user.id)}
                  >
                    <Badge
                      variant={"default"}
                      className={`${
                        user.is_staff
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } px-2 py-1 rounded-full text-xs font-semibold`}
                    >
                      {user.is_staff ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => handleMemberClick(user.id)}
                  >
                    <Badge
                      variant={"default"}
                      className={`${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } px-2 py-1 rounded-full text-xs font-semibold`}
                    >
                      {user.is_active ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={() => handleMemberClick(user.id)}
                  >
                    <p className="font-medium text-left">
                      {formatPostDate(user.date_joined)}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* -- PAGINATION -- */}
      <div className=" flex justify-center">
        <SmartPagination paginationData={paginationData} />
      </div>
    </div>
  );
}

export default page;
