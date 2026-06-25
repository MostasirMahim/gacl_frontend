"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function GenerateRunForm() {
  const now = new Date();
  const [name, setName] = useState("");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [force, setForce] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function generate() {
    if (!name.trim()) {
      toast.error("Give the run a name");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post("/api/payroll/v1/payroll/runs/", {
        name,
        period_year: year,
        period_month: month,
        force,
      });
      toast.success(
        force ? "Payroll run regenerated" : "Payroll run generated"
      );
      setName("");
      queryClient.invalidateQueries({ queryKey: ["getPayrollRuns"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Generate Payroll Run</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Generates payslips for every staff member with a current salary structure,
        applying earnings, deductions and active loan repayments.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Run name</label>
          <Input placeholder="e.g. June 2026 Payroll" value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Month</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Year</label>
            <Input type="number" value={year}
              onChange={(e) => setYear(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-md border border-border/60 p-3">
          <input
            id="force-regen"
            type="checkbox"
            className="mt-1"
            checked={force}
            onChange={(e) => setForce(e.target.checked)}
          />
          <label htmlFor="force-regen" className="text-sm">
            Regenerate if a run already exists for this period
            <span className="block text-xs text-muted-foreground">
              Replaces the existing (unpaid) run so updated salary structures
              take effect. Disabled if any payslip in the period is already paid.
            </span>
          </label>
        </div>
        <Button onClick={generate} disabled={loading} className="w-full">
          {loading ? "Generating..." : force ? "Regenerate Run" : "Generate Run"}
        </Button>
      </div>
    </div>
  );
}

export default GenerateRunForm;
