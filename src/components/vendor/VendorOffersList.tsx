"use client";
import { useState } from "react";
import useGetVendorOffers from "@/hooks/data/useGetVendorOffers";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";

const STATUS_VARIANT: Record<string, any> = {
  offered: "secondary",
  selected: "default",
  rejected: "destructive",
};

function PayDialog({ offer }: { offer: any }) {
  const [amount, setAmount] = useState(offer.price);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function pay() {
    try {
      setLoading(true);
      await axiosInstance.post(
        `/api/vendor/v1/vendors/offers/${offer.id}/pay/`,
        { amount: Number(amount), note }
      );
      toast.success("Vendor payment recorded");
      queryClient.invalidateQueries({ queryKey: ["getVendorOffers"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Pay</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay {offer.vendor_name}</DialogTitle>
        </DialogHeader>
        <label className="text-sm font-medium">Amount</label>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <label className="text-sm font-medium">Note</label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
        <Button onClick={pay} disabled={loading}>
          {loading ? "Processing..." : "Record Payment"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function VendorOffersList() {
  const { data, isLoading } = useGetVendorOffers();
  const queryClient = useQueryClient();
  const offers = data?.data || [];

  async function select(offerId: number) {
    try {
      await axiosInstance.post(
        `/api/vendor/v1/vendors/offers/${offerId}/select/`,
        {}
      );
      toast.success("Vendor selected — competing offers disabled");
      queryClient.invalidateQueries({ queryKey: ["getVendorOffers"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Selection failed");
    }
  }

  if (isLoading) return <LoadingDots />;

  // group by category for clarity
  const byCategory: Record<string, any[]> = {};
  offers.forEach((o: any) => {
    (byCategory[o.category_name] = byCategory[o.category_name] || []).push(o);
  });

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Vendor Offers</h2>
        <p className="text-sm text-muted-foreground">
          Selecting an offer makes it the active vendor for its category and
          disables all competing offers.
        </p>
      </div>
      {Object.keys(byCategory).length === 0 && (
        <p className="text-center text-muted-foreground py-6">No offers yet.</p>
      )}
      {Object.entries(byCategory).map(([category, list]) => (
        <div key={category}>
          <h3 className="font-medium mb-2">{category}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.vendor_name}</TableCell>
                  <TableCell>{o.title}</TableCell>
                  <TableCell>BDT {o.price}</TableCell>
                  <TableCell>{o.billing_cycle}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[o.status] || "secondary"}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {o.status !== "selected" && o.status !== "rejected" && (
                      <Button size="sm" onClick={() => select(o.id)}>
                        Select
                      </Button>
                    )}
                    {o.status === "selected" && <PayDialog offer={o} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}

export default VendorOffersList;
