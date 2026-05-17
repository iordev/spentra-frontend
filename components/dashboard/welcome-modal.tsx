"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";
import {
  Wallet,
  BarChart3,
  Target,
  Bell,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  X,
  ImageIcon,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/context/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/useAuth";

interface WelcomeModalProps {
  open: boolean;
  onComplete: () => void;
  firstName: string;
}

const tutorialSteps = [
  {
    icon: Sparkles,
    title: "Welcome to Spentra! 🎉",
    description: "Your personal finance companion is ready.",
    color: "text-primary",
    bg: "bg-primary/10",
    image: null, // replace with "/images/onboarding/welcome.png"
  },
  {
    icon: Wallet,
    title: "Track Your Expenses",
    description: "Log daily expenses and see where your money goes.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    image: null, // replace with "/images/onboarding/expenses.png"
  },
  {
    icon: Target,
    title: "Set Your Budget",
    description: "Create budgets and get alerts before you overspend.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    image: null, // replace with "/images/onboarding/budget.png"
  },
  {
    icon: BarChart3,
    title: "Visualize Your Finances",
    description: "Beautiful charts to track your spending trends.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    image: null, // replace with "/images/onboarding/charts.png"
  },
  {
    icon: Bell,
    title: "Stay on Track",
    description: "Smart insights to help you reach your financial goals.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    image: null, // replace with "/images/onboarding/notifications.png"
  },
];

export function WelcomeModal({ open, onComplete, firstName }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const queryClient = useQueryClient();
  const { me } = useAuth();

  const step = tutorialSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tutorialSteps.length - 1;
  const Icon = step.icon;

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await userService.completeOnboarding();
      if (me) {
        // ✅ replaces setUser — updates React Query cache directly
        queryClient.setQueryData(authKeys.me, { ...me, isOnboarded: true });
      }
      onComplete();
    } catch {
      onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = async () => {
    await handleComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg p-0 gap-0 overflow-hidden"
        onInteractOutside={e => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Welcome to Spentra</DialogTitle>
          <DialogDescription>A quick tour of Spentra features</DialogDescription>
        </VisuallyHidden>

        {/* Skip button — floats over image */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 z-20 rounded-full p-1.5 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          disabled={isCompleting}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Large image area — ~65% of modal height */}
        <div className="w-full h-72 bg-muted relative overflow-hidden">
          {step.image ? (
            <Image
              src={step.image}
              alt={step.title}
              fill
              className="object-cover transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className={`rounded-3xl p-6 ${step.bg}`}>
                <Icon className={`h-14 w-14 ${step.color}`} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                <ImageIcon className="h-3 w-3" />
                <span>Screenshot placeholder</span>
              </div>
            </div>
          )}

          {/* Progress bar at top of image */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/10">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-background to-transparent" />
        </div>

        {/* Bottom content — compact text + controls */}
        <div className="px-6 pt-3 pb-5 flex flex-col gap-4">
          {/* Text */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              {isFirst ? `Welcome, ${firstName}! 👋` : step.title}
            </h2>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>

          {/* Clickable step dots */}
          <div className="flex items-center justify-center gap-1.5">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-5 h-1.5 bg-primary"
                    : index < currentStep
                      ? "w-1.5 h-1.5 bg-primary/40"
                      : "w-1.5 h-1.5 bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isCompleting}
                className="h-9 w-9 shrink-0"
                aria-label="Back"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <Button
              className="flex-1 flex items-center justify-center gap-2 h-9"
              onClick={isLast ? handleComplete : () => setCurrentStep(prev => prev + 1)}
              disabled={isCompleting}
            >
              {isCompleting ? (
                "Setting up..."
              ) : isLast ? (
                <>
                  Get started
                  <Rocket className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Skip link — always rendered to prevent height shift */}
          <div className="text-center h-4">
            {!isLast && (
              <button
                onClick={handleSkip}
                disabled={isCompleting}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                Skip tutorial
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
