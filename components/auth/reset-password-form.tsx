"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "../navigation/mode-toggle";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordFormData, resetPasswordSchema } from "@/lib/schemas/auth.schema";

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const isButtonDisabled =
    !newPassword ||
    !confirmPassword ||
    !!errors.newPassword ||
    !!errors.confirmPassword ||
    isLoading;

  const requirements = [
    { label: "At least 8 characters", met: newPassword?.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPassword ?? "") },
    { label: "One number", met: /\d/.test(newPassword ?? "") },
    {
      label: "One special character",
      met: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword ?? ""),
    },
  ];

  // Redirect if no token in URL
  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const onSubmit = async (formData: ResetPasswordFormData) => {
    if (!token) return;
    setIsLoading(true);
    setServerError("");

    try {
      await authService.resetPassword(token, formData.newPassword, formData.confirmPassword);
      setIsSuccess(true);
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

  if (!token) return null;

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
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">Enter your new password below</p>
        </div>

        <div className="flex flex-col gap-5">
          {isSuccess ? (
            /* Success state */
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Password Reset!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your password has been reset successfully. You can now sign in with your new
                  password.
                </p>
              </div>
              <Button className="w-full" onClick={() => router.push("/signin")}>
                Go to Sign In
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
                      <span className="font-semibold">Reset failed.</span>{" "}
                      <span className="text-destructive/80">{serverError}</span>
                    </p>
                  </div>
                )}

                {/* New Password */}
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="pr-10"
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      className="absolute right-3 inset-y-0 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password requirements checklist */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      {requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-1.5 w-1.5 rounded-full shrink-0",
                              req.met ? "bg-primary" : "bg-muted-foreground/40"
                            )}
                          />
                          <p
                            className={cn(
                              "text-xs transition-colors",
                              req.met ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {req.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.newPassword && (
                    <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                  )}
                </Field>

                {/* Confirm Password */}
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="pr-10"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="absolute right-3 inset-y-0 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </Field>

                <Field>
                  <Button type="submit" disabled={isButtonDisabled} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
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
