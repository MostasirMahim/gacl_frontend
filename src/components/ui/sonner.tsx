"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function SonnerToaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group font-primary"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-foreground group-[.toaster]:border-border/80 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl font-primary text-xs",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold text-xs rounded-lg",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium text-xs rounded-lg",
          error: "group-[.toaster]:border-destructive/30 text-destructive",
          success: "group-[.toaster]:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
          warning: "group-[.toaster]:border-amber-500/30 text-amber-600 dark:text-amber-400",
          info: "group-[.toaster]:border-sky-500/30 text-sky-600 dark:text-sky-400",
        },
      }}
      {...props}
    />
  );
}

export { SonnerToaster as Toaster };
