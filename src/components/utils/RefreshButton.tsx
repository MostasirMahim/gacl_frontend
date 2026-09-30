"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";

interface RefreshButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  showText?: boolean;
  title?: string;
}

export default function RefreshButton({
  className = "",
  size = "default",
  children,
  showText,
  title = "Refresh",
}: RefreshButtonProps = {}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const shouldRenderText =
    showText !== undefined ? showText : size !== "icon" && children !== null;

  return (
    <Button
      variant="outline"
      size={size}
      title={title}
      aria-label={title}
      onClick={() => startTransition(() => router.refresh())}
      className={`hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer ${
        shouldRenderText ? "gap-1.5" : ""
      } ${className}`}
    >
      <RefreshCcwIcon className={`h-3.5 w-3.5 shrink-0 ${isPending ? "animate-spin" : ""}`} />
      {shouldRenderText && (children !== undefined ? children : "Refresh")}
    </Button>
  );
}
