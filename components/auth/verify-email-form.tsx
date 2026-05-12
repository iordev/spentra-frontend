"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "../navigation/mode-toggle";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function VerifyEmailForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = useCallback(
    async (verifyToken: string) => {
      setIsVerifying(true);
      setServerError("");
      try {
        await authService.verifyEmail(verifyToken);
        setIsVerified(true);
        setTimeout(() => {
          router.push("/signin?verified=true");
        }, 3000);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setServerError(
            err.response?.data?.message || "Verification failed. The link may have expired."
          );
        } else {
          setServerError("Verification failed. The link may have expired.");
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (token) {
      void handleVerify(token);
    }
  }, [token, handleVerify]);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setServerError("");
    try {
      await authService.resendVerificationEmail(email);
      startCooldown();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className={cn(
        "relative min-h-screen flex items-center justify-center bg-background px-4 py-4",
        className
      )}
      {...props}
    >
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/signin">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sign In
          </Link>
        </Button>
        <ModeToggle />
      </div>

      <div className="w-full max-w-md pt-20">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/favicon.ico" alt="App logo" />
                <AvatarFallback className="rounded-lg">S</AvatarFallback>
              </Avatar>
              <span className="font-medium">Spentra</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 text-center">
          {/* Verifying state */}
          {isVerifying && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Verifying your email</h1>
                <p className="text-muted-foreground mt-2">Please wait a moment...</p>
              </div>
            </div>
          )}

          {/* Verified success state */}
          {!isVerifying && isVerified && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Email Verified!</h1>
                <p className="text-muted-foreground mt-2">
                  Your email has been verified successfully.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Redirecting you to sign in...</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/signin">Go to Sign In</Link>
              </Button>
            </div>
          )}

          {/* Check email state (no token in URL yet) */}
          {!isVerifying && !isVerified && !token && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <MailCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
                <p className="text-sm text-muted-foreground mt-1">We sent a verification link to</p>
                {email && <p className="text-sm font-medium text-foreground mt-0.5">{email}</p>}
                <p className="text-xs text-muted-foreground mt-3">
                  Click the link in your email to verify your account. Didn&apos;t receive it? Check
                  your spam folder.
                </p>
              </div>

              {/* Server error */}
              {serverError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3 w-full text-left">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="text-sm text-destructive">
                    <span className="font-semibold">Failed to resend.</span>{" "}
                    <span className="text-destructive/80">{serverError}</span>
                  </p>
                </div>
              )}

              {/* Resend button */}
              <Button
                className="w-full"
                disabled={resendCooldown > 0 || isResending || !email}
                onClick={handleResend}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            </div>
          )}

          {/* Error state (token present but verification failed) */}
          {!isVerifying && !isVerified && token && serverError && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
                <p className="text-muted-foreground mt-2">{serverError}</p>
              </div>

              {/* Resend button */}
              {email && (
                <Button
                  className="w-full"
                  disabled={resendCooldown > 0 || isResending}
                  onClick={handleResend}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href="/signin">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
