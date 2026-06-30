"use client";

import { useEffect } from "react";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("MFM Page Render Error:", error);
  }, [error]);

  const isPermissionError =
    error.message?.toLowerCase().includes("permission") ||
    error.message?.toLowerCase().includes("unauthorized") ||
    error.message?.toLowerCase().includes("status code 403") ||
    error.message?.toLowerCase().includes("status code 401");

  if (isPermissionError) {
    return (
      <div className="p-6">
        <RestrictedAccessPlaceholder
          featureName="Financial Feature"
          message="You do not have the required financial permissions to view this resource. Please contact your system administrator."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[400px]">
      <div className="text-red-500 font-semibold text-lg">
        Something went wrong while loading this page
      </div>
      <p className="text-muted-foreground text-sm max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
