"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { WelcomeModal } from "@/components/dashboard/welcome-modal";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const ViewDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();

  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const showWelcome = !loading && !!user && !user.isOnboarded && !welcomeDismissed;

  useEffect(() => {
    const init = async () => {
      // If no user in store (e.g. OAuth redirect), fetch from /auth/me
      if (!user) {
        try {
          const data = await authService.me();
          setUser(data);
        } catch {
          router.replace("/signin");
          return;
        }
      }
      // Simulate loading
      setTimeout(() => setLoading(false), 1500);
    };

    void init();
  }, []);

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
        onComplete={() => setWelcomeDismissed(true)}
        firstName={user?.firstName ?? ""}
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
