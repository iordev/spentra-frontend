"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { WelcomeModal } from "@/components/dashboard/welcome-modal";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ViewDashboardPage = () => {
  const router = useRouter();
  const { me, loading } = useAuth();

  // ✅ derive from me directly — no separate dismissed state needed
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  useEffect(() => {
    if (!loading && !me) router.replace("/signin");
  }, [loading, me, router]);

  // ✅ only show if me exists, not onboarded, and not dismissed
  const showWelcome = !loading && !!me && !me.isOnboarded && !welcomeDismissed;

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-4 w-[90%] mx-auto">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-3 w-[25%]" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
        <Skeleton className="min-h-100 rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <WelcomeModal
        open={showWelcome}
        onComplete={() => {
          setWelcomeDismissed(true); // ✅ hide modal immediately
        }}
        firstName={me?.firstName ?? ""}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min flex justify-center items-center">
          View Dashboard Page
        </div>
      </div>
    </>
  );
};

export default ViewDashboardPage;
