"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/signin");
      return;
    }

    authService
      .exchangeOAuthToken(token)
      .then(user => {
        queryClient.setQueryData(authKeys.me, user); // ✅ replaces setUser
        void queryClient.invalidateQueries({ queryKey: authKeys.me });
        router.replace("/overview/dashboard");
      })
      .catch(() => {
        router.replace("/signin?error=oauth_failed");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
