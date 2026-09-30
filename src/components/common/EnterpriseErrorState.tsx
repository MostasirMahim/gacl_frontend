"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  Copy,
  Check,
  ShieldAlert,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EnterpriseErrorStateProps {
  error: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  featureName?: string;
}

export default function EnterpriseErrorState({
  error,
  reset,
  title = "Something went wrong",
  description,
  backHref = "/restaurants",
  backLabel = "Return to Venues Hub",
  featureName = "Restaurant Operations",
}: EnterpriseErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const errorMessage = error?.message || "An unexpected error occurred.";
  const isPermissionError =
    errorMessage.toLowerCase().includes("permission") ||
    errorMessage.toLowerCase().includes("unauthorized") ||
    errorMessage.toLowerCase().includes("status code 403") ||
    errorMessage.toLowerCase().includes("status code 401") ||
    errorMessage.toLowerCase().includes("forbidden");

  const handleCopyDetails = async () => {
    const details = [
      `Feature: ${featureName}`,
      `Error: ${errorMessage}`,
      error?.digest ? `Digest: ${error.digest}` : null,
      error?.stack ? `Stack:\n${error.stack}` : null,
      `Timestamp: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[460px] w-full p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl bg-card border border-border/80 rounded-2xl shadow-lg p-6 sm:p-8 relative overflow-hidden text-center"
      >
        {/* Subtle Ambient Decorative Gradient Glows */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            {isPermissionError ? "Access Restricted" : "System Notification"}
          </div>

          {/* Halo Icon Container */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-sm">
              {isPermissionError ? (
                <ShieldAlert className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>
            {/* Subtle Outer Ring Effect */}
            <div className="absolute inset-0 -m-1.5 rounded-2xl border border-destructive/15 pointer-events-none animate-pulse" />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-[family-name:var(--font-heading)] mb-2">
            {isPermissionError ? `Access Restricted: ${featureName}` : title}
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
            {description ||
              (isPermissionError
                ? "You do not have the necessary permissions to perform this action or view this resource. Contact your system administrator if you believe this is a mistake."
                : errorMessage.length < 160
                ? errorMessage
                : "A problem occurred while processing this restaurant operation. Please retry or contact technical support if the issue persists.")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md mb-6">
            {reset && (
              <Button
                onClick={() => reset()}
                className="gap-2 h-10 px-5 text-sm font-semibold shadow-xs"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </Button>
            )}

            {backHref && (
              <Link href={backHref}>
                <Button
                  variant="outline"
                  className="gap-2 h-10 px-5 text-sm font-medium shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" /> {backLabel}
                </Button>
              </Link>
            )}
          </div>

          {/* Back to Home Quick Link */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <Home className="w-3.5 h-3.5" /> Back to Operations Dashboard
            </Link>
          </div>

          {/* Diagnostic Details Accordion */}
          <div className="w-full pt-4 border-t border-border/60">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium focus:outline-none"
            >
              <span>{showDetails ? "Hide Diagnostic Details" : "View Diagnostic Details"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showDetails ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 text-left overflow-hidden w-full"
                >
                  <div className="bg-muted/70 rounded-xl p-3.5 border border-border/70 text-xs font-mono text-muted-foreground space-y-2 relative">
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <span className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                        Exception Log
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyDetails}
                        className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-1 overflow-x-auto max-h-48 custom-scrollbar">
                      <p className="text-destructive font-medium break-all">
                        {errorMessage}
                      </p>
                      {error?.digest && (
                        <p className="text-muted-foreground text-[11px]">
                          Digest: <span className="text-foreground">{error.digest}</span>
                        </p>
                      )}
                      {error?.stack && (
                        <pre className="text-[10px] text-muted-foreground/80 whitespace-pre-wrap leading-tight pt-1">
                          {error.stack}
                        </pre>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
