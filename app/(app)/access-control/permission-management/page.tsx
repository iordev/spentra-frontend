"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { PermissionsTab } from "@/components/access-control/permissions-tab";

const ViewPermissionManagementPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4">
        {/* HEADER */}
        <div className="flex items-center gap-4 w-[90%] mx-auto">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-3 w-[25%]" />
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>

        {/* MAIN CONTENT */}
        <Skeleton className="min-h-100 rounded-xl" />
      </div>
    );
  }

  return <PermissionsTab />;
};

export default ViewPermissionManagementPage;
