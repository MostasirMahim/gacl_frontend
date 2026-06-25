"use client";
import { useState, useEffect } from "react";
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
  value: string;
}

function SalaryStructureForm() {
  const { data: staffData } = useGetStaffProfiles();
  const { data: componentsData } = useGetSalaryComponents();
  const queryClient = useQueryClient();
  const staff = staffData?.data || [];
  const components = componentsData?.data || [];

  const [staffId, setStaffId] = useState("");
  const [basic, setBasic] = useState<string>("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [pickComponent, setPickComponent] = useState("");
  const [pickValue, setPickValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // update mode: if the selected staff already has a structure
  const [existingId, setExistingId] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  // When staff changes, check for an existing current structure to update.
  useEffect(() => {
    if (!staffId) {
      setExistingId(null);
      return;
    }
    let active = true;
    (async () => {
      setChecking(true);
      try {
        const res = await axiosInstance.get(
          `/api/payroll/v1/payroll/structures/?staff_id=${staffId}`
        );
        const structures = res?.data?.data || [];
        const current =
          structures.find((s: any) => s.is_current) || structures[0];
        if (active && current) {
          setExistingId(current.id);
          setBasic(String(current.basic_salary ?? ""));
          setEffectiveFrom(current.effective_from || "");
          setLines(
            (current.lines || []).map((l: any) => ({
              component: String(l.component),
              componentName: l.component_name || "",
              value: String(l.value),
            }))
          );
          toast.info("Existing structure loaded — you can update it.");
        } else if (active) {
          setExistingId(null);
          setBasic("");
          setEffectiveFrom("");
          setLines([]);
        }
      } catch {
        if (active) setExistingId(null);
      } finally {
        if (active) setChecking(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [staffId]);

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
      { component: pickComponent, componentName: comp?.name || "", value: pickValue || "0" },
    ]);
    setPickComponent("");
    setPickValue("");
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
      if (existingId) {
        // UPDATE existing structure (Bug 6.2)
        await axiosInstance.patch(
          `/api/payroll/v1/payroll/structures/${existingId}/`,
          {
            basic_salary: Number(basic),
            effective_from: effectiveFrom,
            is_current: true,
            lines: lines.map((l) => ({
              component: Number(l.component),
              value: Number(l.value),
            })),
          }
        );
        toast.success("Salary structure updated");
      } else {
        // CREATE new structure
        const res = await axiosInstance.post(
          "/api/payroll/v1/payroll/structures/",
          {
            staff: Number(staffId),
            basic_salary: Number(basic),
            effective_from: effectiveFrom,
            is_current: true,
          }
        );
        const structureId = res?.data?.data?.id;
        for (const l of lines) {
          await axiosInstance.post("/api/payroll/v1/payroll/structures/lines/", {
            structure: structureId,
            component: Number(l.component),
            value: Number(l.value),
          });
        }
        toast.success("Salary structure created");
      }
      setStaffId("");
      setBasic("");
      setEffectiveFrom("");
      setLines([]);
      setExistingId(null);
      queryClient.invalidateQueries({ queryKey: ["getPayrollRuns"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save structure");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-1">
        {existingId ? "Update Salary Structure" : "Build Salary Structure"}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Select a staff member. If they already have a salary structure, it loads
        for editing; otherwise a new one is created.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Staff</label>
          <Select value={staffId} onValueChange={setStaffId}>
            <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
            <SelectContent>
              {staff.map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.staff_ID} — {s.full_name || s.designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {checking && (
            <p className="text-xs text-muted-foreground mt-1">
              Checking for existing structure…
            </p>
          )}
          {existingId && (
            <Badge variant="outline" className="mt-2">
              Editing existing structure #{existingId}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Basic Salary</label>
            <Input type="number" min={0} value={basic}
              onChange={(e) => setBasic(e.target.value)} />
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
                onChange={(e) => setPickValue(e.target.value)} />
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
          {loading
            ? "Saving..."
            : existingId
            ? "Update Structure"
            : "Create Structure"}
        </Button>
      </div>
    </div>
  );
}

export default SalaryStructureForm;
