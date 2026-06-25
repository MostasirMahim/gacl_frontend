"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetGuests from "@/hooks/data/useGetGuests";
import useGetRFIDCards from "@/hooks/data/useGetRFIDCards";
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
} from "@/components/ui/dialog";
import { LoadingDots } from "@/components/ui/loading";
import { CreditCard, Trash2 } from "lucide-react";

export default function GuestList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetGuests(search || undefined);
  const guests = data?.data || [];

  // assign temp card dialog
  const [assignGuest, setAssignGuest] = useState<any>(null);
  const [selCard, setSelCard] = useState("");
  const { data: cardData } = useGetRFIDCards({ cardType: "guest_temporary" });
  const guestCards = cardData?.data || [];

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["getGuests"] });

  async function assignCard() {
    if (!selCard) return toast.error("Select a card");
    try {
      await axiosInstance.patch(
        `/api/attendance/v1/attendance/guests/${assignGuest.id}/`,
        { temporary_card: Number(selCard) }
      );
      toast.success("Temporary card assigned");
      setAssignGuest(null);
      setSelCard("");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to assign card");
    }
  }

  async function removeGuest(id: number) {
    try {
      await axiosInstance.delete(`/api/attendance/v1/attendance/guests/${id}/`);
      toast.success("Guest removed");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to remove guest");
    }
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Registered Guests</h2>
      <div className="max-w-sm">
        <Input
          placeholder="Search by name, phone or host member ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Relation</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Temp Card</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((g: any) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell>{g.phone}</TableCell>
                <TableCell className="capitalize">{g.guest_relation}</TableCell>
                <TableCell>{g.host_name || "—"}</TableCell>
                <TableCell>
                  {g.temporary_card_uid ? (
                    <Badge variant="default">{g.temporary_card_uid}</Badge>
                  ) : (
                    <Badge variant="secondary">None</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAssignGuest(g)}
                  >
                    <CreditCard className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => removeGuest(g.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {guests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No guests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!assignGuest} onOpenChange={(o) => !o && setAssignGuest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Temporary Card — {assignGuest?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">
              Choose an available guest-temporary card
            </label>
            <Select value={selCard} onValueChange={setSelCard}>
              <SelectTrigger>
                <SelectValue placeholder="Select card" />
              </SelectTrigger>
              <SelectContent>
                {guestCards.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.card_uid}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={assignCard} className="w-full">
              Assign Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
