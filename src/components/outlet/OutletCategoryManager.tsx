"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import useGetOutletCategories from "@/hooks/data/useGetOutletCategories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingDots } from "@/components/ui/loading";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

export default function OutletCategoryManager() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetOutletCategories();
  const categories = data?.data || [];
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["getOutletCategories"] });

  async function create() {
    if (!name.trim()) return toast.error("Category name required");
    try {
      await axiosInstance.post("/api/outlet/v1/outlets/categories/", {
        name: name.trim(),
      });
      toast.success("Category created");
      setName("");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create");
    }
  }

  async function saveEdit(id: number) {
    try {
      await axiosInstance.patch(`/api/outlet/v1/outlets/categories/${id}/`, {
        name: editName.trim(),
      });
      toast.success("Category updated");
      setEditId(null);
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update");
    }
  }

  async function remove(id: number) {
    try {
      await axiosInstance.delete(`/api/outlet/v1/outlets/categories/${id}/`);
      toast.success("Category deleted");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Item Categories</h2>
      <div className="flex gap-2">
        <Input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
        />
        <Button onClick={create} className="gap-2">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell>
                  {editId === c.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    c.name
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {editId === c.id ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => saveEdit(c.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditId(c.id);
                          setEditName(c.name);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => remove(c.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No categories yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
