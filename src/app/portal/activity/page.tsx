"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card } from "@/components/ui/card";
import { LoadingDots } from "@/components/ui/loading";
import { format } from "date-fns";
import { Activity, Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PortalActivityLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["portalActivityLogs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/activity_log/v1/activity/user_activity/");
      return res.data?.data || [];
    },
  });

  const getSeverityIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBg = (level: string) => {
    switch (level?.toLowerCase()) {
      case "error":
        return "bg-red-50 border-red-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "success":
        return "bg-green-50 border-green-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" /> Activity Logs
        </h1>
        <p className="text-muted-foreground mt-1">
          Review your recent actions and system events.
        </p>
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : !logs || logs.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          No activity logs found.
        </Card>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/80 before:to-transparent">
          {logs.map((log: any) => (
            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                {getSeverityIcon(log.severity_level)}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-foreground text-sm">{log.verb}</h3>
                  <time className="text-xs text-muted-foreground font-medium">
                    {log.timestamp ? format(new Date(log.timestamp), "MMM d, yyyy h:mm a") : ""}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  {log.description}
                </p>
                {log.ip_address && (
                  <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                    IP: {log.ip_address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
