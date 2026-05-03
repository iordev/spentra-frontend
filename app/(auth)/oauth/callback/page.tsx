import { Suspense } from "react";
import { OAuthCallbackContent } from "@/components/auth/oauth-callback";

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallbackContent />
    </Suspense>
  );
}
