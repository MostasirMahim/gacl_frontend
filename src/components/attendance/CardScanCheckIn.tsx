"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { ScanLine } from "lucide-react";

function CardScanCheckIn() {
  const [cardUid, setCardUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  async function scan() {
    if (!cardUid.trim()) {
      toast.error("Enter or scan a card UID");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/attendance/v1/attendance/scan/",
        { card_uid: cardUid.trim() }
      );
      const msg = res?.data?.message || "Done";
      toast.success(msg);
      setLast(`${msg} — ${new Date().toLocaleTimeString()}`);
      setCardUid("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ScanLine className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">RFID Check-in / Check-out</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Scan a card or type its UID. The system toggles check-in/out automatically.
      </p>
      <div className="flex gap-2">
        <Input
          autoFocus
          placeholder="Card UID"
          value={cardUid}
          onChange={(e) => setCardUid(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && scan()}
        />
        <Button onClick={scan} disabled={loading}>
          {loading ? "..." : "Scan"}
        </Button>
      </div>
      {last && (
        <div className="mt-4 text-sm rounded-md bg-muted p-3">{last}</div>
      )}
    </div>
  );
}

export default CardScanCheckIn;
