"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const ViewBankPage = () => {
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min flex justify-center items-center">
        View Bank Page
      </div>
    </div>
  );
};

export default ViewBankPage;
