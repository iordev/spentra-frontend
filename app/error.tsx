// app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeft, RefreshCw, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="/favicon.ico" alt="Spentra logo" />
            <AvatarFallback className="rounded-lg text-xs font-semibold">S</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">Spentra</span>
        </div>
        <ModeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Error 500
        </div>

        <div className="rounded-full bg-destructive/10 p-6 mb-6">
          <RefreshCw className="h-12 w-12 text-destructive" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            An unexpected error occurred. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button className="w-full sm:w-auto flex items-center gap-2" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>

        <div className="mt-6">
          <Link
            href="/overview/dashboard"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
