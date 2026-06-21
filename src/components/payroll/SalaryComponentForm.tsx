"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";

function SalaryComponentForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [type, setType] = useState("earning");
  const [calc, setCalc] = useState("fixed");
  const [taxable, setTaxable] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim()) {
      toast.error("Component name required");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post("/api/payroll/v1/payroll/components/", {
        name, component_type: type, calc_type: calc, is_taxable: taxable,
      });
      toast.success("Component created");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["getSalaryComponents"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create component");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add Salary Component</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input placeholder="e.g. House Rent, Tax, PF" value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="earning">Earning</SelectItem>
                <SelectItem value="deduction">Deduction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Calculation</label>
            <Select value={calc} onValueChange={setCalc}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed amount</SelectItem>
                <SelectItem value="percent_of_basic">% of basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={taxable} onCheckedChange={setTaxable} />
          <span className="text-sm">Taxable</span>
        </div>
        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Add Component"}
        </Button>
      </div>
    </div>
  );
}

export default SalaryComponentForm;
