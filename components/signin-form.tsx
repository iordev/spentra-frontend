"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // for App Router
import React, { useState } from "react";

export function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  // Keep track of form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would normally call your backend API to sign in
    console.log("Sign in complete:", { email, password });

    // Redirect to dashboard (static for now)
    router.push("/overview/dashboard");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-3 text-center">
            {/* Row: Welcome text + logo */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Welcome to</h1>
              <Link href="#">
                {/* Light logo - visible in light mode */}
                <Image
                  src="/spentra-light-logo.png"
                  alt="Spentra logo light"
                  width={120}
                  height={40}
                  priority
                  className="w-auto h-auto object-contain dark:hidden"
                />

                <Image
                  src="/spentra-dark-logo.png"
                  alt="Spentra logo dark"
                  width={120}
                  height={40}
                  priority
                  className="w-auto h-auto object-contain hidden dark:block"
                />
              </Link>
            </div>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="user@example.com" required />
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" required />
          </Field>
          <Field>
            <Button type="submit">Sign in</Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or continue with
          </FieldSeparator>
          <Field className="grid grid-cols-3 gap-4">
            <Button variant="outline" type="button">
              {/* Google */}
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
              {/* Microsoft */}
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
              {/* Facebook */}
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
        <Link href="/register" className="text-primary underline">
          Sign up
        </Link>
      </FieldDescription>
      {/*<FieldDescription className="px-6 text-center">*/}
      {/*  By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}*/}
      {/*  <a href="#">Privacy Policy</a>.*/}
      {/*</FieldDescription>*/}
    </div>
  );
}
