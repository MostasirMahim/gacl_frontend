"use client";
import useGetVendorPayments from "@/hooks/data/useGetVendorPayments";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingDots } from "@/components/ui/loading";

const MONTHS = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function VendorPaymentsList() {
  const { data, isLoading } = useGetVendorPayments();
  const payments = data?.data || [];

  if (isLoading) return <LoadingDots />;

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Vendor Payment History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Paid On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p: any, idx: number) => (
            <TableRow key={p.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="font-medium">{p.vendor_name}</TableCell>
              <TableCell>{p.category_name}</TableCell>
              <TableCell>BDT {p.amount}</TableCell>
              <TableCell>
                <Badge variant="secondary">{p.payment_type}</Badge>
              </TableCell>
              <TableCell>
                {p.payment_type === "monthly" && p.period_month
                  ? `${MONTHS[p.period_month]} ${p.period_year || ""}`
                  : "—"}
              </TableCell>
              <TableCell>{p.reference || "—"}</TableCell>
              <TableCell>
                {p.paid_on ? new Date(p.paid_on).toLocaleDateString() : "—"}
              </TableCell>
            </TableRow>
          ))}
          {payments.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No payments recorded yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
