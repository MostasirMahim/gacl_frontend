"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UtensilsCrossed, Store, Plus, Search, Tag, Sparkles } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

interface Props {
  data: any;
  state: "cuisine" | "category" | string;
}

export default function ShowRestaurantChoices({ data, state }: Props) {
  const dataList: any[] = data?.data || [];
  const paginationData = data?.pagination;
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCuisine = state === "cuisine";
  const title = isCuisine ? "Cuisine Types" : "Restaurant Categories";
  const Icon = isCuisine ? UtensilsCrossed : Store;

  // Filter items by search
  const filtered = useMemo(() => {
    if (!search.trim()) return dataList;
    return dataList.filter((item: any) =>
      item.name?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [dataList, search]);

  const currentPage = paginationData?.current_page || 1;
  const totalPages = paginationData?.total_pages || 1;

  const goToPage = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      router.push(`?page=${page}`);
      router.refresh();
    }
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = isCuisine
        ? "/api/restaurants/v1/restaurants/cusines/"
        : "/api/restaurants/v1/restaurants/categories/";

      await axiosInstance.post(endpoint, { name: newItemName.trim() });
      toast.success(`${isCuisine ? "Cuisine" : "Category"} created successfully`);
      setNewItemName("");
      setModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create item");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs space-y-4 flex flex-col justify-between h-full">
      <div className="space-y-3">
        {/* Header & Quick Action */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground leading-tight">{title}</h4>
              <p className="text-[11px] text-muted-foreground font-medium">
                {dataList.length} configured in system
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-8 text-xs font-semibold gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add {isCuisine ? "Cuisine" : "Category"}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Filter ${title.toLowerCase()}...`}
            className="w-full h-8 bg-muted/40 border border-border/80 rounded-md pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors font-medium"
          />
        </div>

        {/* Items Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto no-scrollbar pr-0.5">
            {filtered.map((item: any, ind: number) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                    {ind + 1}
                  </span>
                  <span className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                </div>
                <Tag className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 group-hover:text-primary/70 transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No matching {title.toLowerCase()} found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-2 border-t border-border/50 flex justify-center">
          <Pagination>
            <PaginationContent className="scale-90">
              {paginationData?.previous && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => goToPage(i + 1)}
                    isActive={i + 1 === currentPage}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {paginationData?.next && (
                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Quick Add Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Create New {isCuisine ? "Cuisine Type" : "Restaurant Category"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure a new classification for Saint Club dining venues and menu items.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {isCuisine ? "Cuisine Name" : "Category Name"}
              </label>
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={isCuisine ? "e.g. Pan-Asian, Italian, Seafood" : "e.g. Fine Dining, Rooftop Grill"}
                className="text-xs h-9 bg-muted/40"
                autoFocus
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                className="text-xs h-8 bg-primary text-primary-foreground font-semibold"
              >
                {submitting ? "Saving..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
