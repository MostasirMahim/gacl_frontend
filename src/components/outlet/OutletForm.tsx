"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useGetOutlets from "@/hooks/data/useGetOutlets";
import { LoadingDots } from "@/components/ui/loading";
import { Pencil, Trash2 } from "lucide-react";

function OutletForm() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data: outletData, isLoading } = useGetOutlets();
  const outlets = outletData?.data || [];

  const [editOutlet, setEditOutlet] = useState<any>(null);
  const [editValues, setEditValues] = useState<any>({});

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["getOutlets"] });
  const form = useForm({
    defaultValues: {
      name: "",
      outlet_type: "bar",
      description: "",
      address: "",
      phone: "",
      capacity: "" as any,
    },
  });
  const { setError } = form;

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      const payload = {
        ...values,
        capacity: values.capacity === "" ? 0 : Number(values.capacity),
      };
      const res = await axiosInstance.post("/api/outlet/v1/outlets/", payload);
      if (res.status === 201) {
        toast.success("Outlet created");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["getOutlets"] });
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        for (const key in errors) {
          if (key !== "non_field_errors")
            setError(key as any, { type: "server", message: errors[key][0] });
        }
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(o: any) {
    setEditOutlet(o);
    setEditValues({
      name: o.name,
      outlet_type: o.outlet_type,
      description: o.description || "",
      phone: o.phone || "",
      capacity: o.capacity ?? "",
    });
  }

  async function saveEdit() {
    try {
      await axiosInstance.patch(`/api/outlet/v1/outlets/${editOutlet.id}/`, {
        ...editValues,
        capacity:
          editValues.capacity === "" ? 0 : Number(editValues.capacity),
      });
      toast.success("Outlet updated");
      setEditOutlet(null);
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  }

  async function deleteOutlet(id: number) {
    try {
      await axiosInstance.delete(`/api/outlet/v1/outlets/${id}/`);
      toast.success("Outlet deactivated");
      refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create Outlet</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl><Input placeholder="e.g. Sky Bar" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outlet_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="tea_lounge">Tea Lounge</SelectItem>
                    <SelectItem value="cigar_lounge">Cigar Lounge</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="e.g. 50"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Outlet"}
          </Button>
        </form>
      </Form>

      {/* Existing outlets list */}
      <div className="mt-8">
        <h3 className="font-semibold mb-3">Existing Outlets</h3>
        {isLoading ? (
          <LoadingDots />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outlets.map((o: any) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {String(o.outlet_type).replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{o.capacity}</TableCell>
                  <TableCell>{o.phone || "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(o)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => deleteOutlet(o.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {outlets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No outlets yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editOutlet} onOpenChange={(o) => !o && setEditOutlet(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Outlet</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input
                value={editValues.name || ""}
                onChange={(e) =>
                  setEditValues({ ...editValues, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Type</label>
              <Select
                value={editValues.outlet_type}
                onValueChange={(v) =>
                  setEditValues({ ...editValues, outlet_type: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="tea_lounge">Tea Lounge</SelectItem>
                  <SelectItem value="cigar_lounge">Cigar Lounge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Description</label>
              <Textarea
                value={editValues.description || ""}
                onChange={(e) =>
                  setEditValues({ ...editValues, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Phone</label>
                <Input
                  value={editValues.phone || ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Capacity</label>
                <Input
                  type="number"
                  min={0}
                  value={editValues.capacity ?? ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, capacity: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={saveEdit} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OutletForm;
