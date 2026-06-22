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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useGetOutlets from "@/hooks/data/useGetOutlets";
import useGetOutletCategories from "@/hooks/data/useGetOutletCategories";

function OutletItemForm() {
  const { data: outletsData } = useGetOutlets();
  const { data: categoriesData } = useGetOutletCategories();
  const outlets = outletsData?.data || [];
  const categories = categoriesData?.data || [];
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      unit: "",
      unit_cost: 0,
      selling_price: 0,
      availability: true,
      spicy_selectable: false,
      is_public_show: false,
      category: "",
      outlet: "",
    },
  });
  const { setError } = form;

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/outlet/v1/outlets/items/", values);
      if (res.status === 201) {
        toast.success("Item posted");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["getOutletItems"] });
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Post Menu Item</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
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
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl><Input placeholder="glass / pcs" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Cost</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selling_price"
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="outlet"
              rules={{ required: "Select an outlet" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outlet</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {outlets.map((o: any) => (
                        <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Select a category" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Available</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spicy_selectable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Spicy selectable</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_public_show"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Public show</FormLabel>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Posting..." : "Post Item"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default OutletItemForm;
