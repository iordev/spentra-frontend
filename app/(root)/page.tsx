"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, BarChart3, Lock } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignInForm } from "@/components/signin-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ModeToggle } from "@/components/mode-toggle";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="/favicon.ico" alt="App logo" />
              <AvatarFallback className="rounded-lg">S</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Spentra</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* SIGN IN MODAL */}
            <Dialog>
              <ModeToggle />

              <DialogTrigger asChild>
                <Button variant="ghost">Sign In</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[460px] p-8">
                {/* REQUIRED for accessibility */}
                <DialogTitle>
                  <VisuallyHidden>Sign in to Spentra</VisuallyHidden>
                </DialogTitle>

                <DialogDescription>
                  <VisuallyHidden>
                    Use your email or continue with social login to sign in to Spentra.
                  </VisuallyHidden>
                </DialogDescription>

                {/* Your actual sign-in form */}
                <SignInForm />
              </DialogContent>
            </Dialog>

            {/* SIGN UP PAGE */}
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6 text-pretty">
            Take Control of Your Money
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Track expenses, manage budgets, and achieve your financial goals with Spentra's
            intelligent expense tracking platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Here
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/*<Button*/}
            {/*  size="lg"*/}
            {/*  variant="outline"*/}
            {/*  className="border-border text-foreground hover:bg-muted bg-transparent"*/}
            {/*>*/}
            {/*  View Demo*/}
            {/*</Button>*/}
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl bg-card p-8 border border-border hover:border-primary/50 transition-all duration-300">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Tracking</h3>
              <p className="text-muted-foreground">
                Automatically categorize and track your expenses with intelligent analytics and
                insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-2xl bg-card p-8 border border-border hover:border-primary/50 transition-all duration-300">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Visual Insights</h3>
              <p className="text-muted-foreground">
                Beautiful charts and reports to understand your spending patterns at a glance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl bg-card p-8 border border-border hover:border-primary/50 transition-all duration-300">
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your financial data is encrypted and protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-primary text-primary-foreground p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Your Budget?</h2>
          <p className="text-primary-foreground/90 mb-8">
            Join thousands of users who are taking control of their finances with Spentra.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            {/*<div className="flex items-center gap-2">*/}
            {/*  <Avatar className="h-8 w-8 rounded-lg">*/}
            {/*    <AvatarImage src="/favicon.ico" alt="App logo" />*/}
            {/*    <AvatarFallback className="rounded-lg">S</AvatarFallback>*/}
            {/*  </Avatar>*/}
            {/*  <div className="flex flex-col gap-0.5 leading-none">*/}
            {/*    <span className="font-medium">Spentra</span>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <p className="text-muted-foreground text-sm">
              © {new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", year: "numeric" })}{" "}
              Spentra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
