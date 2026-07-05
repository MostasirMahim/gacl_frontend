"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useMyInvoices } from "@/hooks/data/usePortal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingDots } from "@/components/ui/loading";

function PayDialog({ invoice }: { invoice: any }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function pay(mode: "online" | "due") {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/api/member/v1/portal/invoices/${invoice.id}/pay/`,
        { mode }
      );
      const gateway = res?.data?.data?.gateway_url;
      if (mode === "online" && gateway) {
        window.location.href = gateway;
        return;
      }
      toast.success(res?.data?.message || "Done");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["portalInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["portalDashboard"] });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Pay</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Bill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm">
            <p className="text-muted-foreground">Amount due</p>
            <p className="text-2xl font-bold">BDT {invoice.balance_due}</p>
          </div>
          <div className="space-y-2">
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => pay("online")}
            >
              Pay Online (Card / Mobile Banking)
            </Button>
            <Button
              className="w-full"
              variant="outline"
              disabled={loading}
              onClick={() => pay("due")}
            >
              Charge to My Club Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            "Charge to account" adds this to your dues; the club settles it
            later.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MyBillsPage() {
  const [unpaidOnly, setUnpaidOnly] = useState(false);
  const { data: invoices, isLoading } = useMyInvoices(unpaidOnly);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Bills</h1>

      <Tabs
        value={unpaidOnly ? "unpaid" : "all"}
        onValueChange={(v) => setUnpaidOnly(v === "unpaid")}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <LoadingDots />
      ) : !invoices || invoices.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          No bills to show.
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv: any) => (
            <Card key={inv.id} className="p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold">
                    Invoice #{inv.id}
                    {inv.invoice_type_name ? ` · ${inv.invoice_type_name}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total BDT {inv.total_amount} · Due BDT {inv.balance_due}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={inv.is_full_paid ? "outline" : "secondary"}>
                    {inv.is_full_paid ? "Paid" : inv.status || "Unpaid"}
                  </Badge>
                  {!inv.is_full_paid && <PayDialog invoice={inv} />}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
