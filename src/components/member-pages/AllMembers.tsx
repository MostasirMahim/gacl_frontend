"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileSpreadsheet,
  TrainTrackIcon,
  Calendar,
  Users,
  UserRoundSearch,
  RefreshCcwIcon,
  Settings2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoadingDots, LoadingPage } from "@/components/ui/loading";
import useGetAllMembers, {
  exportMembersExcel,
} from "@/hooks/data/useGetAllMembers";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddMemberStore } from "@/store/store";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import { Card } from "../ui/card";
import { getNames } from "country-list";
import CustomAlertDialog from "../ui/custom-alert";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { SmartPagination } from "../utils/SmartPagination";

interface FilterState {
  date_of_birth?: Date;
  membership_type?: string;
  membership_status?: string;
  blood_group?: string;
  gender?: string;
  institute_name?: string;
  marital_status?: string;
  download_excel?: boolean | undefined;
  nationality?: string;
  contact_number?: string;
  email?: string;
  member_ID?: string;
  name?: string;
}
const initialFilters: FilterState = {
  date_of_birth: undefined,
  membership_type: "",
  membership_status: "",
  blood_group: "",
  gender: "",
  institute_name: "",
  marital_status: "",
  download_excel: undefined,

  nationality: "",
  contact_number: "",
  email: "",
  member_ID: "",
  name: "",
};
function AllMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const { setMemberID, setIsUpdateMode, } =
    useAddMemberStore();
  const searchParams = useSearchParams();
  const countries = getNames();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserFilterOpen, setIsUserFilterOpen] = useState(false);
  const page = Number(searchParams.get("page")) || 1;
  const routes = 1;
  const {
    data: allMembersReq,
    isLoading: user_isLoading,
    refetch,
    isFetching,
  } = useGetAllMembers(page, filters, routes);
  const allMembers = allMembersReq?.data;
  const paginationData = allMembersReq?.pagination;
  const { data: choiceSections } = useGetAllChoice();

  const {
    membership_type,
    institute_name,
    gender,
    membership_status,
    marital_status,
  } = choiceSections ?? {};

  const { mutate: deleteMember, isPending } = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await axiosInstance.delete(
        `/api/member/v1/members/${memberId}/`
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
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        if (errors && typeof errors === "object") {
          Object.entries(errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              toast.error(field, messages[0]);
            }
          });
          toast.error(detail || message || "Member Delete Failed");
        }
      } else {
        toast.error(detail || message || "Member Delete Failed");
      }
    },
  });

  const updateFilter = (
    key: keyof FilterState,
    value: string | boolean | Date | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setTimeout(() => refetch(), 0);
  };
  const resetRetry = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setIsFilterOpen(false);
    setTimeout(() => refetch(), 0);
  };

  const filteredUsers =
    allMembers?.filter((user: any) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.member_ID.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];
  const router = useRouter();
  const handleMemberClick = (member_ID: string) => {
    router.push(`/member/view/${member_ID}`);
  };

  const handleExport = () => {
    exportMembersExcel(page, filters);
    refetch();
  };

  const handleUpdate = (member_ID: string) => {
    setMemberID(member_ID);
    setIsUpdateMode(true);
    router.push(`/member/update/${member_ID}`);
  };
  const handleIdTransfer = (member_ID: string) => {
    router.push(`/member/transferID/${member_ID}`);
  };
  const handleDelete = (member_ID: string) => {
    deleteMember(member_ID);
  };

  if (user_isLoading) return <LoadingDots />;
  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ALL Members</h1>
          <p className="text-muted-foreground">
            A list of all members in the system.
          </p>
        </div>

        <div>
          <Button className="gap-1" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div
        className={`w-full  ${
          isFilterOpen ? "shadow-lg border rounded-lg" : ""
        }`}
      >
         <div className="flex md:hidden flex-row items-center justify-between gap-4 my-4">
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
                  </Button>
                </div>
        <div className="flex flex-row items-center justify-end gap-4">
          <div className="hidden md:block relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Members..."
              className="pl-10 focus-visible:ring-0 bg-background focus-visible:ring-offset-0 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <Button
            variant="outline"
            onClick={() => refetch()}
            className="hidden md:flex gap-2 h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <RefreshCcwIcon
             className={`h-4 w-4 ${isFetching && "animate-spin"}`}
            />
            Refresh
          </Button>

          <Button
            variant={isFilterOpen ? "default" : "outline"}
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              if (!isFilterOpen) setIsUserFilterOpen(false);
            }}
            className="w-full md:w-auto gap-2 h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button
            variant={isUserFilterOpen ? "default" : "outline"}
            onClick={() => {
              setIsUserFilterOpen(!isUserFilterOpen);
              if (!isUserFilterOpen) setIsFilterOpen(false);
            }}
            className="w-full md:w-auto gap-2 h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <UserRoundSearch className="h-4 w-4" />
            Query
          </Button>
        </div>

        {isFilterOpen && (
          <div className="border-t-2 rounded-b-md mt-1 border-primary bg-background p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.date_of_birth ? (
                        format(filters.date_of_birth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={filters.date_of_birth}
                      onSelect={(date) => {
                        if (date) {
                          const formatted = format(date, "yyyy-MM-dd");
                          updateFilter("date_of_birth", formatted);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Membership Type
                </Label>
                <Select
                  value={filters.membership_type}
                  onValueChange={(value) =>
                    updateFilter("membership_type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Membership Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {membership_type?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Membership Status
                </Label>
                <Select
                  value={filters.membership_status}
                  onValueChange={(value) =>
                    updateFilter("membership_status", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Membership Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {membership_status?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Blood Group
                </Label>
                <Select
                  value={filters.blood_group}
                  onValueChange={(value) => updateFilter("blood_group", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Institute Name
                </Label>
                <Select
                  value={filters.institute_name}
                  onValueChange={(value) =>
                    updateFilter("institute_name", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Institute" />
                  </SelectTrigger>
                  <SelectContent>
                    {institute_name?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name} - {choice.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Marital Status
                </Label>
                <Select
                  value={filters.marital_status}
                  onValueChange={(value) =>
                    updateFilter("marital_status", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="What's Marital Status?" />
                  </SelectTrigger>
                  <SelectContent>
                    {marital_status?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select
                  value={filters.gender}
                  onValueChange={(value) => updateFilter("gender", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Gender">
                      {filters.gender}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {gender?.map((choice: any, index: number) => (
                      <SelectItem key={index} value={choice.name}>
                        {choice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col  items-center justify-center gap-2">
                <Button className="" onClick={() => refetch()}>
                  <Filter className="h-4 w-4" />
                  {isFetching ? "Filtering..." : "Apply"}
                </Button>
                <Button
                  className=""
                  variant="destructive"
                  onClick={() => resetFilters()}
                >
                   <Settings2 className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
        {isUserFilterOpen && (
          <div className="border-t-2 rounded-b-md mt-1 border-primary bg-background p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Member ID</Label>
                <Input
                  type="text"
                  placeholder="Search by ID..."
                  className="bg-background"
                  value={filters.member_ID}
                  onChange={(e) => updateFilter("member_ID", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  type="text"
                  placeholder="Search by name..."
                  className="bg-background"
                  value={filters.name}
                  onChange={(e) => updateFilter("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contact Number</Label>
                <Input
                  type="text"
                  placeholder="Search by contact..."
                  className="bg-background"
                  value={filters.contact_number}
                  onChange={(e) =>
                    updateFilter("contact_number", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="text"
                  placeholder="Search by email..."
                  className="bg-background"
                  value={filters.email}
                  onChange={(e) => updateFilter("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Nationality
                </Label>
                <Select
                  value={filters.nationality}
                  onValueChange={(value) => updateFilter("nationality", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map((name: any, index: number) => (
                      <SelectItem key={index} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <Button onClick={() => refetch()}>
                  <Filter className="h-4 w-4" />
                  {isFetching ? "Filtering..." : "Apply"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => resetFilters()}
                >
                <Settings2 className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-md border my-2 font-secondary">
        <Table>
          <TableHeader>
            <TableRow className="text-center font-bold h-14 bg-primary/20 border-b-2 border-primary dark:bg-accent">
              <TableHead className="font-bold text-center">
                ID
              </TableHead>
              <TableHead className="font-bold">
                Member
              </TableHead>
              <TableHead className="font-bold">
                Type
              </TableHead>
              <TableHead className="font-bold">
                Status
              </TableHead>
              <TableHead className="font-bold">
                Batch
              </TableHead>
              <TableHead className="font-bold text-center">
                Martial St.
              </TableHead>
              <TableHead className="font-bold text-center">
                DOB
              </TableHead>
              <TableHead className="font-bold">
                Blood
              </TableHead>
              <TableHead className="font-bold ">
                Nationality
              </TableHead>
              <TableHead className="text-center font-bold">
                Actions
              </TableHead>
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
                        <Search className="h-4 w-4" />
                        {isFetching ? "Retrying Search.." : "Reset Filters"}
                      </Button>
                    </div>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: any) => (
                <TableRow
                  key={user.member_ID}
                  className="cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out bg-background "
                >
                  <TableCell
                    className="font-medium "
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    {user.member_ID}
                  </TableCell>
                  <TableCell
                    className="flex justify-start items-center"
                    onClick={() => handleMemberClick(user.member_ID)}
                  >
                    <div className="space-y-1 ">
                      <p className="font-medium text-left">
                        {user.first_name + " " + user.last_name}
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
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleUpdate(user.member_ID)}
                        >
                          <Pencil className="h-4 w-4" /> Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleIdTransfer(user.member_ID)}
                        >
                          <TrainTrackIcon className="h-4 w-4" /> Transfer ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteDialogOpen(true);
                            setSelectedMemberId(user.member_ID);
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

      {/* -- PAGINATION -- */}
      <div className=" flex justify-center">
        <SmartPagination paginationData={paginationData} />
      </div>

      <CustomAlertDialog
        open={deleteDialogOpen}
        title="Are you sure?"
        description={`Do you want to delete ${selectedMemberId} member?`}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedMemberId) handleDelete(selectedMemberId);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

export default AllMembers;
