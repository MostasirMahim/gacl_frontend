"use client";
import useGetVendorCategories from "@/hooks/data/useGetVendorCategories";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingDots } from "@/components/ui/loading";

export default function VendorCategoriesList() {
  const { data, isLoading } = useGetVendorCategories();
  const categories = data?.data || [];

  if (isLoading) return <LoadingDots />;

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Vendor Service Categories</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell className="font-mono">{c.id}</TableCell>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.description || "—"}</TableCell>
              <TableCell>
                <Badge variant={c.is_active ? "default" : "secondary"}>
                  {c.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No categories yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
