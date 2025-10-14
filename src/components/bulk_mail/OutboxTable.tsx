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

import { Button } from "../ui/button";
import { Ban, MailCheck, MailsIcon, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { SmartPagination } from "../utils/SmartPagination";
import RefreshButton from "../utils/RefreshButton";

interface Props {
  data: any;
}

const OutboxTable = ({ data }: Props) => {
  const outboxData = data?.data;
  const paginationData = data?.pagination;

  const handleRetry = async () => {
    try {
      const response = await axiosInstance.post("/api/mails/v1/emails/retry/");
      if (response.status == 200) {
        toast.success("Retry process started successfully for failed email.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  //TODO: Need to added scrool table body.

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-2xl sm:text-3xl font-bold">Outbox List</h4>
            <p className="hidden md:block text-muted-foreground">
              All emails sent from the software are listed here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div>
              <RefreshButton />
            </div>
            <Button variant="destructive" onClick={handleRetry}>
              {" "}
              <RotateCcw /> Retry
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableCaption>Outbox</TableCaption>
        <TableHeader>
          <TableRow className="text-center font-semibold h-14 bg-primary/20 border-b-2 border-primary dark:bg-accent">
            <TableHead className="">Id</TableHead>
            <TableHead className="">Email Address</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Email Compose</TableHead>
            <TableHead className="">Is from template</TableHead>
            <TableHead className="text-center">Failed Reason</TableHead>
            <TableHead className="">Created at</TableHead>
            <TableHead className="">Updated at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outboxData.map((outbox: any) => (
            <TableRow key={outbox.id} className="text-center bg-background">
              <TableCell className="">{outbox.id}</TableCell>
              <TableCell className="">{outbox.email_address}</TableCell>
              <TableCell>{outbox.status== 'failed' ? <p className="text-red-500">FAILED</p> : <p className="text-green-500">{outbox.status?.toString().toUpperCase()}</p>}</TableCell>
              <TableCell>{outbox.email_compose}</TableCell>
              <TableCell className="">
                {outbox.is_from_template ? "Yes" : "No"}
              </TableCell>
              <TableCell className="flex justify-center">
                <p className="line-clamp-3 tracking-tight text-center text-red-500">{outbox.failed_reason ? outbox.failed_reason : <MailCheck className="text-green-500"/>}</p>
              </TableCell>
              <TableCell className="">
                {new Date(outbox.created_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="">
                {new Date(outbox.updated_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SmartPagination paginationData={paginationData} />
    </div>
  );
};

export default OutboxTable;
