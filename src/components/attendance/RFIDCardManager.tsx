"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetRFIDCards from "@/hooks/data/useGetRFIDCards";
import useGetStaffProfiles from "@/hooks/data/useGetStaffProfiles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingDots } from "@/components/ui/loading";
import MemberSelectModal from "@/components/shared/MemberSelectModal";
import { Plus, History, Trash2 } from "lucide-react";

export default function RFIDCardManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [cardType, setCardType] = useState("");
  const { data, isLoading } = useGetRFIDCards({
    search: search || undefined,
    cardType: cardType || undefined,
  });
  const cards = data?.data || [];

  // create form state
  const [newUid, setNewUid] = useState("");
  const [newType, setNewType] = useState("member");
  const [selMember, setSelMember] = useState<any>(null);
  const [selStaff, setSelStaff] = useState<string>("");
  const [creating, setCreating] = useState(false);

  const { data: staffData } = useGetStaffProfiles();
  const staff = staffData?.data || [];

  // history dialog
  const [historyCard, setHistoryCard] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["getRFIDCards"] });

  async function createCard() {
    if (!newUid.trim()) return toast.error("Card UID is required");
    setCreating(true);
    try {
      const payload: any = { card_uid: newUid.trim(), card_type: newType };
      if (newType === "member" && selMember) payload.member = selMember.id;
      if (newType === "staff" && selStaff) payload.staff = Number(selStaff);
      await axiosInstance.post(
        "/api/attendance/v1/attendance/cards/",
        payload
      );
      toast.success("Card registered");
      setNewUid("");
      setSelMember(null);
      setSelStaff("");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to register card");
    } finally {
      setCreating(false);
    }
  }

  async function deactivate(id: number) {
    try {
      await axiosInstance.delete(`/api/attendance/v1/attendance/cards/${id}/`);
      toast.success("Card deactivated");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to deactivate");
    }
  }

  async function openHistory(card: any) {
    setHistoryCard(card);
    setLoadingHistory(true);
    try {
      const res = await axiosInstance.get(
        `/api/attendance/v1/attendance/cards/${card.id}/history/`
      );
      setHistory(res?.data?.data || []);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold">RFID Card Management</h2>

      {/* Create card */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Register / Assign a Card
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground">Card UID</label>
            <Input
              placeholder="Scan or type card UID"
              value={newUid}
              onChange={(e) => setNewUid(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Card Type</label>
            <Select value={newType} onValueChange={setNewType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="guest_temporary">Guest (temporary)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newType === "member" && (
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">Member</label>
              <MemberSelectModal
                value={
                  selMember
                    ? { member_ID: selMember.member_ID, name: selMember.name }
                    : null
                }
                onSelect={(m) => setSelMember(m)}
              />
            </div>
          )}
          {newType === "staff" && (
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">Staff</label>
              <Select value={selStaff} onValueChange={setSelStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose staff" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.staff_ID} — {s.full_name || s.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button onClick={createCard} disabled={creating}>
          {creating ? "Saving..." : "Register Card"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Search</label>
          <Input
            placeholder="Search UID / member / staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Type</label>
          <Select
            value={cardType || "all"}
            onValueChange={(v) => setCardType(v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="guest_temporary">Guest temp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Card list */}
      {isLoading ? (
        <LoadingDots />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card UID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono">{c.card_uid}</TableCell>
                <TableCell className="capitalize">
                  {c.card_type.replace("_", " ")}
                </TableCell>
                <TableCell>{c.assigned_to}</TableCell>
                <TableCell>
                  <Badge variant={c.is_assigned ? "default" : "secondary"}>
                    {c.is_assigned ? "Assigned" : "Unassigned"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openHistory(c)}
                  >
                    <History className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => deactivate(c.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {cards.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No cards found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* History dialog */}
      <Dialog
        open={!!historyCard}
        onOpenChange={(o) => !o && setHistoryCard(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Card History — {historyCard?.card_uid}
            </DialogTitle>
          </DialogHeader>
          {loadingHistory ? (
            <LoadingDots />
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h: any) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.subject_name || "—"}</TableCell>
                      <TableCell>
                        {new Date(h.check_in).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {h.check_out
                          ? new Date(h.check_out).toLocaleString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No history for this card
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
