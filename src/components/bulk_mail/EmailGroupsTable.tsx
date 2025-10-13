"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import Link from "next/link";

interface Props {
  data: any;
}

function EmailGroupsTable({ data }: Props) {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(null);
  const router = useRouter();
  const groups = data?.data;
  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/api/mails/v1/email/groups/${deleteGroupId}/`
      );
      const data = response.data;
      toast.success("Group deleted successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.success("Something went wrong", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  return (
    <div>
      <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteGroupId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Table>
        <TableCaption>
          <div>
            <h4 className="flex items-center justify-center">
              <Send /> Email groups
            </h4>
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-primary/20 dark:bg-accent">
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">User</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-center">Updated At</TableHead>
            <TableHead className="text-center">View</TableHead>
            <TableHead className="text-center">Update</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="text-center">{group.id}</TableCell>
              <TableCell className="text-center capitalize">
                {group.name || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {group.description || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {group.user || "—"}
              </TableCell>

              <TableCell className="text-center">
                {new Date(group.created_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="text-center">
                {new Date(group.updated_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell>
                <Button variant="outline">
                  <Link href={`/emails/groups/${group.id}`}>View</Link>
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="default" disabled>
                  Update
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteGroupId(group.id);
                    setOpenDeleteAlert(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EmailGroupsTable;
