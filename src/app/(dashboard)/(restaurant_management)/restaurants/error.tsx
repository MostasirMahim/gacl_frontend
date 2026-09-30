"use client";

import EnterpriseErrorState from "@/components/common/EnterpriseErrorState";

export default function RestaurantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EnterpriseErrorState
      error={error}
      reset={reset}
      title="Restaurant Operations Error"
      description="An issue occurred while loading this restaurant service or dataset. You can retry the request or return to the restaurants dashboard."
      backHref="/restaurants"
      backLabel="Return to Venues Hub"
      featureName="Restaurant Management"
    />
  );
}
