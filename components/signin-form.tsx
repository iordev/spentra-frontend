"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle"; // adjust path if needed
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { authService } from "@/services/auth.service";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormData, signInSchema } from "@/lib/schemas/auth.schema";
import { useForm } from "react-hook-form";

export function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const identifier = watch("identifier");
  const password = watch("password");

  const isEmail = identifier?.includes("@");
  const isEmailValid = isEmail ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) : true;
  const isButtonDisabled = !identifier || !password || !isEmailValid || isLoading;

  const cleanError = (message: string) => {
    return message.replace(/\(at\s[\d:]+\s[AP]M\)\./g, "").trim();
  };
  const onSubmit = async (formData: SignInFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      await authService.login(formData.identifier, formData.password);
      router.push("/overview/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const raw = err.response?.data?.message || "Something went wrong. Please try again.";
        setServerError(cleanError(raw));
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
      {/* Top bar: back button left, mode toggle right */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
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
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Spentra</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
        </div>

        {/* Original Sign In Form — untouched */}
        <div className={cn("flex flex-col gap-5")}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Server error */}
              {serverError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="text-sm text-destructive">
                    <span className="font-semibold">Sign in failed.</span>{" "}
                    <span className="text-destructive/80">{serverError}</span>
                  </p>
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="identifier">Email or Username</FieldLabel>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="user@example.com or username"
                  disabled={isLoading}
                  {...register("identifier")}
                />
                {isEmail && !isEmailValid && (
                  <p className="text-xs text-destructive">Invalid email format.</p>
                )}
                {errors.identifier && !isEmail && (
                  <p className="text-xs text-destructive">{errors.identifier.message}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isButtonDisabled} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M21.35 11.1H12v3.7h5.38c-.23 1.2-1.42 3.52-5.38 3.52-3.24 0-5.89-2.68-5.89-5.99s2.65-5.99 5.89-5.99c1.85 0 3.09.79 3.8 1.47l2.59-2.49C16.81 3.77 14.6 2.8 12 2.8 6.92 2.8 2.8 6.92 2.8 12S6.92 21.2 12 21.2c6.93 0 8.63-4.86 8.63-7.38 0-.5-.05-.87-.12-1.22z" />
                  </svg>
                  <span className="sr-only">Sign in with Google</span>
                </Button>
                <Button variant="outline" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M2 2h9v9H2zM13 2h9v9h-9zM2 13h9v9H2zM13 13h9v9h-9z" />
                  </svg>
                  <span className="sr-only">Sign in with Microsoft</span>
                </Button>
                <Button variant="outline" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M22.68 0H1.32C.59 0 0 .6 0 1.33v21.35C0 23.4.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.66-4.79 1.32 0 2.46.1 2.79.14v3.24h-1.92c-1.5 0-1.79.72-1.79 1.76v2.31h3.59l-.47 3.62h-3.12V24h6.12c.73 0 1.32-.6 1.32-1.32V1.33C24 .6 23.41 0 22.68 0z" />
                  </svg>
                  <span className="sr-only">Sign in with Facebook</span>
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <FieldDescription className="px-6 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary underline">
              Sign up
            </Link>
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
