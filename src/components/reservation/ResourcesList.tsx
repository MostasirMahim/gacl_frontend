"use client";
import useGetResources from "@/hooks/data/useGetResources";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingDots } from "@/components/ui/loading";

function ResourcesList() {
  const { data, isLoading } = useGetResources();
  const resources = data?.data || [];

  if (isLoading) return <LoadingDots />;

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Reservable Resources</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Advance</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Max/Member</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((r: any) => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell className="capitalize">{r.resource_type.replace("_", " ")}</TableCell>
              <TableCell>BDT {r.advance_amount}</TableCell>
              <TableCell>{r.capacity}</TableCell>
              <TableCell>{r.max_per_member}</TableCell>
              <TableCell>
                <Badge variant={r.status === "open" ? "default" : "secondary"}>
                  {r.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {resources.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No resources configured
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ResourcesList;
