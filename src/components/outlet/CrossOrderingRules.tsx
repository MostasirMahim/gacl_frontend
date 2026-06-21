"use client";
import { useState } from "react";
import useGetCrossRules from "@/hooks/data/useGetCrossRules";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingDots } from "@/components/ui/loading";

const SOURCES = ["bar", "tea_lounge", "cigar_lounge"];
const TARGETS = ["bar", "tea_lounge", "cigar_lounge", "restaurant"];

function CrossOrderingRules() {
  const { data, isLoading } = useGetCrossRules();
  const queryClient = useQueryClient();
  const rules = data?.data || [];

  const [source, setSource] = useState("bar");
  const [target, setTarget] = useState("cigar_lounge");
  const [allowed, setAllowed] = useState(true);
  const [requiresRoom, setRequiresRoom] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveRule() {
    if (source === target) {
      toast.error("Source and target must differ (same-outlet is always allowed)");
      return;
    }
    try {
      setSaving(true);
      await axiosInstance.post("/api/outlet/v1/outlets/cross-rules/", {
        source_type: source,
        target_type: target,
        allowed,
        requires_room_number: requiresRoom,
      });
      toast.success("Rule saved");
      queryClient.invalidateQueries({ queryKey: ["getCrossRules"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save rule");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
        <h2 className="text-xl font-semibold mb-1">Cross-Ordering Rules</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Control which outlet can order from which source. Same-outlet ordering is
          always allowed. Any combination without a rule defaults to denied.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Sitting in (source)</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Can order from (target)</label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TARGETS.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={allowed} onCheckedChange={setAllowed} />
            <span className="text-sm">Allowed</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={requiresRoom} onCheckedChange={setRequiresRoom} />
            <span className="text-sm">Requires room number</span>
          </div>
        </div>
        <Button onClick={saveRule} disabled={saving} className="mt-4">
          {saving ? "Saving..." : "Save Rule"}
        </Button>
      </div>

      <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Current Rules</h3>
        {isLoading ? (
          <LoadingDots />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Allowed</TableHead>
                <TableHead>Room required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="capitalize">{r.source_type.replace("_", " ")}</TableCell>
                  <TableCell className="capitalize">{r.target_type.replace("_", " ")}</TableCell>
                  <TableCell>
                    <Badge variant={r.allowed ? "default" : "destructive"}>
                      {r.allowed ? "Allowed" : "Denied"}
                    </Badge>
                  </TableCell>
                  <TableCell>{r.requires_room_number ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No rules configured yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default CrossOrderingRules;
