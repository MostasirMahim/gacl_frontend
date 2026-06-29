"use client";

import React from "react";
import { Lock } from "lucide-react";

interface RestrictedAccessPlaceholderProps {
  featureName?: string;
  requiredPermission?: string | null;
  message?: string;
}

export const RestrictedAccessPlaceholder: React.FC<RestrictedAccessPlaceholderProps> = ({
  featureName = "Feature",
  requiredPermission,
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 m-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 text-center space-y-4">
      <div className="p-4 rounded-full bg-muted text-muted-foreground">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-lg font-semibold text-foreground">
          Access Restricted: {featureName}
        </h3>
        <p className="text-sm text-muted-foreground">
          {message ||
            `You do not have the required permission (${
              requiredPermission || "restricted"
            }) to access or interact with this feature.`}
        </p>
      </div>
    </div>
  );
};

export default RestrictedAccessPlaceholder;
