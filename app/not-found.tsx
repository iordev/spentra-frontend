"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

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

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Error 404
        </div>

        <DotLottieReact
          src="https://lottie.host/c8d3d66a-c03f-4edc-a8f5-4382d1e44d48/IxKeF1EH8g.lottie"
          loop
          autoplay
          style={{ width: "min(80vw, 420px)", height: "auto" }}
        />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
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

          <Button className="w-full sm:w-auto flex items-center gap-2" asChild>
            <Link href="/overview/dashboard">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          <span>
            Or try{" "}
            <button
              onClick={() => router.refresh()}
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              refreshing the page
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
