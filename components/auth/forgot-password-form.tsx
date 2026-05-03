"use client";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "components/ui/field";
import { Input } from "components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { ModeToggle } from "components/mode-toggle";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "services/auth.service";
import axios from "axios";
import { useState } from "react";
import { ForgotPasswordFormData, forgotPasswordSchema } from "lib/schemas/auth.schema";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const email = watch("email");
  const isButtonDisabled = !email || !!errors.email || isLoading;

  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = () => {
    setResendCooldown(60); // 60 seconds cooldown
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

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      await authService.forgotPassword(formData.email);
      setSentEmail(formData.email);
      setIsSuccess(true);
      startCooldown();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email and we&#39;ll send you a reset link
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Success state */}
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">{sentEmail}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  The link expires in <span className="font-medium">15 minutes</span>. Didn't
                  receive it? Check your spam folder.
                </p>
              </div>

              {/* Resend button */}
              <Button
                className="w-full"
                disabled={resendCooldown > 0 || isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  setServerError("");
                  try {
                    await authService.forgotPassword(sentEmail);
                    startCooldown();
                  } catch (err) {
                    if (axios.isAxiosError(err)) {
                      setServerError(
                        err.response?.data?.message || "Something went wrong. Please try again."
                      );
                    } else {
                      setServerError("Something went wrong. Please try again.");
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend link in ${resendCooldown}s`
                ) : (
                  "Resend Reset Link"
                )}
              </Button>

              {/* Server error on resend */}
              {serverError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3 w-full">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="text-sm text-destructive">
                    <span className="font-semibold">Failed to resend.</span>{" "}
                    <span className="text-destructive/80">{serverError}</span>
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSuccess(false);
                  setServerError("");
                  setResendCooldown(0);
                }}
              >
                Try a different email
              </Button>
            </div>
          ) : (
            /* Form state */
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Server error */}
                {serverError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    <p className="text-sm text-destructive">
                      <span className="font-semibold">Request failed.</span>{" "}
                      <span className="text-destructive/80">{serverError}</span>
                    </p>
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    disabled={isLoading}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </Field>

                <Field>
                  <Button type="submit" disabled={isButtonDisabled} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          <FieldDescription className="px-6 text-center">
            Remember your password?{" "}
            <Link href="/signin" className="text-primary underline">
              Sign in
            </Link>
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
