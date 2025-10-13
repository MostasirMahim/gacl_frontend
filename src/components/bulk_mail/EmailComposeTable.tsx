"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../ui/button";
import { Ban, RotateCcw, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { useState } from "react";
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
import { SmartPagination } from "../utils/SmartPagination";
import RefreshButton from "../utils/RefreshButton";
interface Props {
  data: any;
}

const EmailComposeTable = ({ data }: Props) => {
  const configData = data?.data;
  const paginationData = data?.pagination;
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deleteComposeId, setDeleteComposeId] = useState(null);

  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/api/mails/v1/email/composes/${deleteComposeId}/`
      );
      if (response.status == 204) {
        toast.success("Compose deleted successfully");
        router.refresh();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  //TODO: Table Body Scrollable.
  return (
    <div>
      <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Compose.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteComposeId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-3xl font-bold">Composes List</h4>
            <p className="text-muted-foreground">
              All composes set by the software are listed here.
            </p>
          </div>
          <RefreshButton />
        </div>
      </div>
      <Table>
        <TableCaption>Composes</TableCaption>
        <TableHeader>
         <TableRow className="text-center  bg-primary/20 border-b-2 border-primary dark:bg-accent">
            <TableHead className="text-center">Id</TableHead>
            <TableHead className="text-center">Subject</TableHead>
            <TableHead className="text-center">Body</TableHead>
            <TableHead className="text-center">configurations</TableHead>
            <TableHead className="text-center">Send</TableHead>
            <TableHead className="text-center">Delete</TableHead>
            <TableHead className="text-center">Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configData.map((config: any) => (
            <TableRow key={config.id} className="text-center bg-background">
              <TableCell className="">{config.id}</TableCell>
              <TableCell className="">{config.subject}</TableCell>
              <TableCell>{config.body.substring(0, 50)}....</TableCell>
              <TableCell>{config.configurations}</TableCell>
              <TableCell>
                <Button variant="default">
                  <Link href={`/emails/compose/send/${config.id}`}>Send</Link>
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteComposeId(config.id);
                    setOpenDeleteAlert(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="secondary" disabled>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SmartPagination paginationData={paginationData} />
    </div>
  );
};

export default EmailComposeTable;
