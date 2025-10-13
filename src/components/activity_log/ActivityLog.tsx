"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { SmartPagination } from "../utils/SmartPagination"

function ActivityLog({ data }: { data: any }) {
  const activityLogs = data?.data
  const paginationData = data?.pagination

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden rounded-md border bg-background">
        <div className="min-w-max h-full flex flex-col">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-primary/90 border-b-2 border-primary">
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-center font-bold text-foreground min-w-[100px]">User</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[140px]">Timestamp</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[120px]">IP Address</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[120px]">Location</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[200px]">User Agent</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[100px]">Request Method</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[150px]">Referrer URL</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[100px]">Device</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[150px]">Path</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[80px]">Verb</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[120px]">Severity Level</TableHead>
                <TableHead className="text-center font-bold text-foreground min-w-[200px]">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
              {activityLogs?.map((log: any, indx: number) => (
                <TableRow key={indx} className="hover:bg-muted/50 transition-colors border-b border-border">
                  <TableCell
                    className="text-center font-medium text-foreground min-w-[100px] max-w-[120px] truncate"
                    title={log.user || "None"}
                  >
                    {log.user || "None"}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground min-w-[140px] text-sm">
                    {new Date(log.timestamp).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell
                    className="text-center text-foreground min-w-[120px] max-w-[140px] truncate font-mono text-sm"
                    title={log.ip_address}
                  >
                    {log.ip_address}
                  </TableCell>
                  <TableCell
                    className="text-center text-foreground min-w-[120px] max-w-[140px] truncate"
                    title={log.location}
                  >
                    {log.location}
                  </TableCell>
                  <TableCell
                    className="text-center text-muted-foreground min-w-[200px] max-w-[250px] truncate text-xs"
                    title={log.user_agent}
                  >
                    {log.user_agent}
                  </TableCell>
                  <TableCell
                    className={`text-center text-xs font-semibold min-w-[100px]
              ${
                log.request_method === "POST"
                  ? "text-blue-800 dark:text-blue-300"
                  : log.request_method === "GET"
                    ? "text-green-800 dark:text-green-300"
                    : log.request_method === "PUT"
                      ? "text-yellow-800 dark:text-yellow-300"
                      : log.request_method === "PATCH"
                        ? "text-purple-800 dark:text-purple-300"
                        : log.request_method === "DELETE"
                          ? "text-red-800 dark:text-red-300"
                          : "text-muted-foreground"
              }
              `}
                  >
                    {log.request_method}
                  </TableCell>
                  <TableCell
                    className="text-center text-muted-foreground min-w-[150px] max-w-[180px] truncate text-sm"
                    title={log.referrer_url}
                  >
                    {log.referrer_url}
                  </TableCell>
                  <TableCell
                    className="text-center text-foreground min-w-[100px] max-w-[120px] truncate"
                    title={log.device}
                  >
                    {log.device}
                  </TableCell>
                  <TableCell
                  className="text-center text-foreground min-w-[200px] max-w-[250px] line-clamp-3 break-words font-mono text-sm"
                    title={log.path}
                  >
                    {log.path}
                  </TableCell>
                  <TableCell
                    className="text-center text-foreground min-w-[80px] max-w-[100px] truncate"
                    title={log.verb}
                  >
                    {log.verb}
                  </TableCell>
                  <TableCell className="text-center min-w-[120px]">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        log.severity_level === "warning"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                          : log.severity_level === "info"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      {log.severity_level}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-center text-foreground min-w-[200px] max-w-[250px] truncate text-sm"
                    title={log.description}
                  >
                    {log.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <SmartPagination paginationData={paginationData} />
      </div>
    </div>
  )
}

export default ActivityLog
