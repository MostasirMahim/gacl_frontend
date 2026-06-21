"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import useGetStaffProfiles from "@/hooks/data/useGetStaffProfiles";
import useGetSalaryComponents from "@/hooks/data/useGetSalaryComponents";

interface LineDraft {
  component: string;
  componentName: string;
  value: number;
}

function SalaryStructureForm() {
  const { data: staffData } = useGetStaffProfiles();
  const { data: componentsData } = useGetSalaryComponents();
  const queryClient = useQueryClient();
  const staff = staffData?.data || [];
  const components = componentsData?.data || [];

  const [staffId, setStaffId] = useState("");
  const [basic, setBasic] = useState(0);
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [pickComponent, setPickComponent] = useState("");
  const [pickValue, setPickValue] = useState(0);
  const [loading, setLoading] = useState(false);

  function addLine() {
    if (!pickComponent) {
      toast.error("Pick a component");
      return;
    }
    const comp = components.find((c: any) => String(c.id) === pickComponent);
    if (lines.some((l) => l.component === pickComponent)) {
      toast.error("Component already added");
      return;
    }
    setLines([
      ...lines,
      { component: pickComponent, componentName: comp?.name || "", value: pickValue },
    ]);
    setPickComponent("");
    setPickValue(0);
  }

  function removeLine(component: string) {
    setLines(lines.filter((l) => l.component !== component));
  }

  async function submit() {
    if (!staffId || !basic || !effectiveFrom) {
      toast.error("Staff, basic salary and effective date are required");
      return;
    }
    try {
      setLoading(true);
      // 1) create the structure
      const res = await axiosInstance.post(
        "/api/payroll/v1/payroll/structures/",
        {
          staff: Number(staffId),
          basic_salary: basic,
          effective_from: effectiveFrom,
          is_current: true,
        }
      );
      const structureId = res?.data?.data?.id;
      // 2) add each component line
      for (const l of lines) {
        await axiosInstance.post("/api/payroll/v1/payroll/structures/lines/", {
          structure: structureId,
          component: Number(l.component),
          value: l.value,
        });
      }
      toast.success("Salary structure created");
      setStaffId("");
      setBasic(0);
      setEffectiveFrom("");
      setLines([]);
      queryClient.invalidateQueries({ queryKey: ["getResources"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create structure");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Build Salary Structure</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Staff</label>
          <Select value={staffId} onValueChange={setStaffId}>
            <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
            <SelectContent>
              {staff.map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.staff_ID} — {s.designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Basic Salary</label>
            <Input type="number" value={basic}
              onChange={(e) => setBasic(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Effective From</label>
            <Input type="date" value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)} />
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium">Components (earnings / deductions)</p>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Select value={pickComponent} onValueChange={setPickComponent}>
                <SelectTrigger><SelectValue placeholder="Component" /></SelectTrigger>
                <SelectContent>
                  {components.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name} ({c.component_type}, {c.calc_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Input type="number" placeholder="value / %" value={pickValue}
                onChange={(e) => setPickValue(Number(e.target.value))} />
            </div>
            <Button type="button" variant="outline" onClick={addLine}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lines.map((l) => (
              <Badge key={l.component} variant="secondary"
                className="cursor-pointer" onClick={() => removeLine(l.component)}>
                {l.componentName}: {l.value} ✕
              </Badge>
            ))}
            {lines.length === 0 && (
              <span className="text-sm text-muted-foreground">No components added</span>
            )}
          </div>
        </div>

        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Create Structure"}
        </Button>
      </div>
    </div>
  );
}

export default SalaryStructureForm;
