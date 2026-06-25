"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingDots } from "@/components/ui/loading";
import { Search, Check } from "lucide-react";

interface Props {
  value?: { member_ID: string; name: string } | null;
  onSelect: (member: { id: number; member_ID: string; name: string }) => void;
  triggerLabel?: string;
}

/**
 * Reusable global member selection modal with server-side search +
 * pagination. Replaces the giant scroll-1000-times dropdowns used in
 * guest registration and reservations.
 */
export default function MemberSelectModal({
  value,
  onSelect,
  triggerLabel = "Select Member",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["memberSelectModal", debounced, page, open],
    enabled: open,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      if (debounced) params.append("name", debounced);
      const res = await axiosInstance.get(
        `/api/member/v1/members/list/?${params.toString()}`
      );
      return res?.data;
    },
  });

  const members = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal">
          {value?.member_ID ? (
            <span>
              {value.member_ID} — {value.name}
            </span>
          ) : (
            <span className="text-muted-foreground">{triggerLabel}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Member</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search by member name..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setDebounced(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="max-h-72 overflow-y-auto mt-2 divide-y divide-border/40">
          {isLoading ? (
            <LoadingDots />
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No members found
            </p>
          ) : (
            members.map((m: any) => {
              const name = `${m.first_name || ""} ${m.last_name || ""}`.trim();
              const selected = value?.member_ID === m.member_ID;
              return (
                <button
                  key={m.id}
                  type="button"
                  className="w-full flex items-center justify-between px-2 py-2 text-left hover:bg-accent rounded-md"
                  onClick={() => {
                    onSelect({ id: m.id, member_ID: m.member_ID, name });
                    setOpen(false);
                  }}
                >
                  <span>
                    <span className="font-medium">{m.member_ID}</span>
                    <span className="text-muted-foreground"> — {name}</span>
                  </span>
                  {selected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })
          )}
        </div>
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.next}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
