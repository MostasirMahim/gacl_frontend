"use client";

import { motion } from "framer-motion";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const isPermissionError =
    error.message?.toLowerCase().includes("permission") ||
    error.message?.toLowerCase().includes("unauthorized") ||
    error.message?.toLowerCase().includes("status code 403") ||
    error.message?.toLowerCase().includes("status code 401");

  if (isPermissionError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full p-6">
        <div className="max-w-md w-full bg-card rounded-xl p-2">
          <RestrictedAccessPlaceholder
            featureName="Protected Dashboard Section"
            message={error.message || "You do not have the required permissions to view this resource. Please contact your system administrator."}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 ">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Oops! Something went wrong 
        </h2>
        <p className="text-gray-600 mb-6 font-bold">{error.message}</p>
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
      </motion.div>
    </div>
  );
}
