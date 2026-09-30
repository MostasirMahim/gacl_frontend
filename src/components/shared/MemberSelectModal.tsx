"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import {
  Search,
  Check,
  User,
  Users,
  Phone,
  Mail,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronsUpDown,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: {
    member_ID: string;
    name: string;
    email?: string;
    phone?: string;
    contact_number?: string;
    membership_type?: string;
    membership_status?: string;
  } | null;
  onSelect: (member: {
    id: number;
    member_ID: string;
    name: string;
    email?: string;
    phone?: string;
    contact_number?: string;
    membership_type?: string;
    membership_status?: string;
  }) => void;
  onClear?: () => void;
  triggerLabel?: string;
  className?: string;
}

const AVATAR_PALETTE = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
  "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25",
];

function getAvatarStyle(id: number | string = 0) {
  const num = typeof id === "number" ? id : String(id).charCodeAt(0);
  return AVATAR_PALETTE[Math.abs(num) % AVATAR_PALETTE.length];
}

function getInitials(firstName?: string, lastName?: string, memberId?: string): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  if (memberId) {
    const parts = memberId.split("-");
    const last = parts[parts.length - 1];
    return last.slice(0, 2).toUpperCase();
  }
  return "MB";
}

/**
 * Reusable universal member selection modal with instant non-case-sensitive search,
 * rich member contact details (phone, email, membership type, status, avatar),
 * and clean pagination.
 */
export default function MemberSelectModal({
  value,
  onSelect,
  onClear,
  triggerLabel = "Select Member",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset search when modal closes
  useEffect(() => {
    if (!open) {
      setSearch("");
      setDebounced("");
      setPage(1);
    }
  }, [open]);

  const { data, isLoading } = useQuery({
    queryKey: ["memberSelectModal", debounced, page, open],
    enabled: open,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("page_size", "40");
      if (debounced.trim()) {
        params.append("search", debounced.trim());
      }
      const res = await axiosInstance.get(
        `/api/member/v1/members/list/?${params.toString()}`
      );
      return res?.data;
    },
  });

  const rawMembers: any[] = data?.data || [];
  const pagination = data?.pagination;
  const totalCount = pagination?.count ?? rawMembers.length;

  // Real-time tokenized client-side filter across all attributes for instant typing response
  const filteredMembers = useMemo(() => {
    if (!search.trim()) return rawMembers;
    const tokens = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return rawMembers;

    return rawMembers.filter((m: any) => {
      const fullName = `${m.first_name || ""} ${m.last_name || ""}`.toLowerCase();
      const memberId = (m.member_ID || "").toLowerCase();
      const email = (m.email || "").toLowerCase();
      const phone = (m.contact_number || "").toLowerCase();
      const type = (m.membership_type || "").toLowerCase();
      const status = (m.membership_status || "").toLowerCase();
      const batch = (m.batch_number || "").toLowerCase();
      const institute = (m.institute_name || "").toLowerCase();
      const haystack = `${fullName} ${memberId} ${email} ${phone} ${type} ${status} ${batch} ${institute}`;

      return tokens.every((t) => haystack.includes(t));
    });
  }, [rawMembers, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal h-10 px-3 bg-card border-border/80 hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer",
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate min-w-0">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            {value?.member_ID ? (
              <span className="text-xs truncate">
                <span className="font-mono font-bold text-primary">{value.member_ID}</span>
                <span className="text-muted-foreground"> · </span>
                <span className="font-semibold text-foreground">{value.name}</span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">{triggerLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {onClear && value?.member_ID ? (
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Clear selected member"
              >
                <X className="w-3.5 h-3.5" />
              </div>
            ) : null}
            <ChevronsUpDown className="w-4 h-4 text-muted-foreground/70 shrink-0" />
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[82vh] sm:max-h-[78vh] flex flex-col gap-0 bg-card border-border/80 shadow-2xl p-0 overflow-hidden rounded-2xl">
        {/* Modal Header */}
        <div className="shrink-0 px-4 pt-3.5 pb-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-sm font-bold text-foreground">
                    Select Member
                  </DialogTitle>
                  {!isLoading && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Search by member ID, full name, phone, email, or category
                </p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mt-2.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus
              placeholder="Search member name, ID (e.g. GACL-M0001), phone, email..."
              className="pl-9 pr-9 h-9 text-xs bg-card border-border/80 focus-visible:ring-primary shadow-2xs font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Member List Container */}
        <div className="flex-1 min-h-0 max-h-[320px] overflow-y-auto p-2.5 sm:p-3 space-y-1.5 custom-scrollbar">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <LoadingDots />
              <p className="text-xs text-muted-foreground">Loading members directory...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-10 px-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto">
                <Users className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs font-semibold text-foreground">No members found</p>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                {search
                  ? `No club members matched "${search}". Try searching by ID, phone number, or last name.`
                  : "No members available in the directory."}
              </p>
            </div>
          ) : (
            filteredMembers.map((m: any) => {
              const fullName = `${m.first_name || ""} ${m.last_name || ""}`.trim() || m.member_ID;
              const selected = value?.member_ID === m.member_ID;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelect({
                      id: m.id,
                      member_ID: m.member_ID,
                      name: fullName,
                      email: m.email,
                      phone: m.contact_number,
                      contact_number: m.contact_number,
                      membership_type: m.membership_type,
                      membership_status: m.membership_status,
                    });
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left py-2 px-2.5 sm:px-3 rounded-lg border transition-all flex items-center justify-between gap-2.5 group cursor-pointer",
                    selected
                      ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-xs"
                      : "bg-card hover:bg-muted/40 border-border/70 hover:border-primary/40 shadow-2xs"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Member Initials Avatar */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 border shadow-2xs overflow-hidden",
                        getAvatarStyle(m.id)
                      )}
                    >
                      {m.profile_photo ? (
                        <img
                          src={m.profile_photo}
                          alt={fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(m.first_name, m.last_name, m.member_ID)
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                          {fullName}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                          {m.member_ID}
                        </span>
                        {m.membership_status && (
                          <span className="text-[9.5px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                            {m.membership_status}
                          </span>
                        )}
                        {m.membership_type && (
                          <span className="text-[9.5px] font-normal px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground border border-border/60">
                            {m.membership_type}
                          </span>
                        )}
                      </div>

                      {/* Contact metadata */}
                      <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                        {m.contact_number && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10.5px]">
                            <Phone className="w-3 h-3 text-muted-foreground/60" />
                            <span>{m.contact_number}</span>
                          </span>
                        )}
                        {m.email && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] truncate max-w-[170px]">
                            <Mail className="w-3 h-3 text-muted-foreground/60" />
                            <span className="truncate">{m.email}</span>
                          </span>
                        )}
                        {m.institute_name && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground/70 truncate max-w-[140px]">
                            <Building2 className="w-3 h-3 text-muted-foreground/50" />
                            <span className="truncate">{m.institute_name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="shrink-0 pl-1">
                    {selected ? (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-border/70 group-hover:border-primary/50 group-hover:bg-primary/5 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Pagination Footer */}
        {pagination && pagination.total_pages > 1 && (
          <div className="shrink-0 px-3.5 py-2 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span>Page</span>
              <span className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-card border border-border/70 font-mono text-[11px] shadow-2xs">
                {pagination.current_page}
              </span>
              <span>of</span>
              <span className="font-semibold text-foreground font-mono text-[11px]">
                {pagination.total_pages}
              </span>
              <span className="text-muted-foreground/60 ml-1">
                ({totalCount} total)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-6.5 px-2 text-[11px] gap-1 border-border/70 hover:bg-card cursor-pointer"
                disabled={!pagination.previous || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Prev</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6.5 px-2 text-[11px] gap-1 border-border/70 hover:bg-card cursor-pointer"
                disabled={!pagination.next || isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
