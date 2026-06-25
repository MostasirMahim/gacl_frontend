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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function PayDialog({ offer }: { offer: any }) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(offer.price);
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [paymentType, setPaymentType] = useState(
    offer.billing_cycle || "one_time"
  );
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [paidOn, setPaidOn] = useState(now.toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function pay() {
    try {
      setLoading(true);
      const payload: any = {
        amount: Number(amount),
        note,
        reference,
        payment_type: paymentType,
        paid_on: paidOn,
      };
      if (paymentType === "monthly") {
        payload.period_month = month;
        payload.period_year = year;
      }
      await axiosInstance.post(
        `/api/vendor/v1/vendors/offers/${offer.id}/pay/`,
        payload
      );
      toast.success("Vendor payment recorded");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getVendorOffers"] });
      queryClient.invalidateQueries({ queryKey: ["getVendorPayments"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Pay</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay {offer.vendor_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Amount</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Payment Type</label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {paymentType === "monthly" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Month</label>
                <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Payment Date</label>
            <Input type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Reference</label>
            <Input value={reference} onChange={(e) => setReference(e.target.value)}
              placeholder="Cheque / Txn ID" />
          </div>
          <div>
            <label className="text-sm font-medium">Note</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button onClick={pay} disabled={loading} className="w-full">
            {loading ? "Processing..." : "Record Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditOfferDialog({ offer }: { offer: any }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(offer.title);
  const [price, setPrice] = useState(offer.price);
  const [cycle, setCycle] = useState(offer.billing_cycle);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function save() {
    try {
      setLoading(true);
      await axiosInstance.patch(`/api/vendor/v1/vendors/offers/${offer.id}/`, {
        title,
        price: Number(price),
        billing_cycle: cycle,
      });
      toast.success("Offer updated");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getVendorOffers"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Offer</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Billing Cycle</label>
            <Select value={cycle} onValueChange={setCycle}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={save} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
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

  async function cancelOffer(offerId: number) {
    try {
      await axiosInstance.delete(`/api/vendor/v1/vendors/offers/${offerId}/`);
      toast.success("Offer cancelled");
      queryClient.invalidateQueries({ queryKey: ["getVendorOffers"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cancel failed");
    }
  }

  if (isLoading) return <LoadingDots />;

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
                <TableHead>Last Payment</TableHead>
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
                    {o.last_payment_date
                      ? new Date(o.last_payment_date).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[o.status] || "secondary"}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    {o.status !== "selected" && o.status !== "rejected" && (
                      <>
                        <Button size="sm" onClick={() => select(o.id)}>
                          Select
                        </Button>
                        <EditOfferDialog offer={o} />
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => cancelOffer(o.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {o.status === "selected" && (
                      <>
                        {/* Bug 8.1: hide Pay if the current period is already paid */}
                        {o.is_paid_current_period ? (
                          <Badge variant="outline">Paid this period</Badge>
                        ) : (
                          <PayDialog offer={o} />
                        )}
                        <EditOfferDialog offer={o} />
                      </>
                    )}
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
