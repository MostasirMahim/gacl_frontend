"use client";
import { useState } from "react";
import useGetPayrollRuns from "@/hooks/data/useGetPayrollRuns";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function PayrollRunsList() {
  const { data, isLoading } = useGetPayrollRuns();
  const queryClient = useQueryClient();
  const runs = data?.data || data?.results || [];

  const [adjustPayslip, setAdjustPayslip] = useState<any>(null);
  const [adj, setAdj] = useState<any>({
    component_name: "",
    component_type: "deduction",
    amount: "",
  });

  async function payslipPay(payslipId: number) {
    try {
      await axiosInstance.post(
        `/api/payroll/v1/payroll/payslips/${payslipId}/pay/`,
        {}
      );
      toast.success("Payslip paid");
      queryClient.invalidateQueries({ queryKey: ["getPayrollRuns"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Payment failed");
    }
  }

  async function saveAdjust() {
    if (!adj.component_name.trim() || !adj.amount) {
      toast.error("Enter a label and amount");
      return;
    }
    try {
      await axiosInstance.post(
        `/api/payroll/v1/payroll/payslips/${adjustPayslip.id}/adjust/`,
        {
          component_name: adj.component_name,
          component_type: adj.component_type,
          amount: Number(adj.amount),
        }
      );
      toast.success("Payslip adjusted");
      setAdjustPayslip(null);
      setAdj({ component_name: "", component_type: "deduction", amount: "" });
      queryClient.invalidateQueries({ queryKey: ["getPayrollRuns"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Adjustment failed");
    }
  }

  if (isLoading) return <LoadingDots />;

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Payroll Runs</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {runs.map((run: any) => (
          <AccordionItem key={run.id} value={String(run.id)} className="border rounded-lg px-3">
            <AccordionTrigger>
              <div className="flex items-center gap-3 flex-1">
                <span className="font-medium">{run.name}</span>
                <span className="text-sm text-muted-foreground">
                  {MONTHS[run.period_month]} {run.period_year}
                </span>
                <Badge variant={run.status === "paid" ? "default" : "secondary"}>
                  {run.status}
                </Badge>
                <span className="ml-auto mr-3 text-sm">BDT {run.total_amount}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {run.payslips?.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.staff_ID}</TableCell>
                      <TableCell>BDT {p.gross_earnings}</TableCell>
                      <TableCell>BDT {p.total_deductions}</TableCell>
                      <TableCell className="font-medium">BDT {p.net_pay}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "paid" ? "default" : "secondary"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {p.status === "generated" && (
                          <>
                            <Button size="sm" onClick={() => payslipPay(p.id)}>
                              Pay
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setAdjustPayslip(p)}
                            >
                              Adjust
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
        {runs.length === 0 && (
          <p className="text-center text-muted-foreground py-6">No payroll runs yet.</p>
        )}
      </Accordion>

      <Dialog open={!!adjustPayslip} onOpenChange={(o) => !o && setAdjustPayslip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Adjust Payslip — {adjustPayslip?.staff_ID}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Type</label>
              <Select
                value={adj.component_type}
                onValueChange={(v) => setAdj({ ...adj, component_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deduction">Deduction</SelectItem>
                  <SelectItem value="earning">Earning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Label</label>
              <Input
                placeholder="e.g. Late fine"
                value={adj.component_name}
                onChange={(e) => setAdj({ ...adj, component_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amount</label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 100"
                value={adj.amount}
                onChange={(e) => setAdj({ ...adj, amount: e.target.value })}
              />
            </div>
            <Button onClick={saveAdjust} className="w-full">
              Apply Adjustment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollRunsList;
