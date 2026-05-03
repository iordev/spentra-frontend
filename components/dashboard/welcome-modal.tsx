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
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface WelcomeModalProps {
  open: boolean;
  onComplete: () => void;
  firstName: string;
}

const tutorialSteps = [
  {
    icon: Sparkles,
    title: "Welcome to Spentra! 🎉",
    description:
      "Your personal finance companion is ready. Let's take a quick tour to help you get the most out of Spentra.",
    color: "text-primary",
    bg: "bg-primary/10",
    image: null, // replace with "/images/onboarding/welcome.png"
  },
  {
    icon: Wallet,
    title: "Track Your Expenses",
    description:
      "Log your daily expenses in seconds. Categorize them automatically and see where your money goes each month.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    image: null, // replace with "/images/onboarding/expenses.png"
  },
  {
    icon: Target,
    title: "Set Your Budget",
    description:
      "Create monthly budgets for different categories. Spentra will alert you when you're getting close to your limits.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    image: null, // replace with "/images/onboarding/budget.png"
  },
  {
    icon: BarChart3,
    title: "Visualize Your Finances",
    description:
      "Beautiful charts and reports give you a clear picture of your spending habits and financial trends over time.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    image: null, // replace with "/images/onboarding/charts.png"
  },
  {
    icon: Bell,
    title: "Stay on Track",
    description:
      "Get smart notifications and insights to help you reach your financial goals. You're all set — let's get started!",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    image: null, // replace with "/images/onboarding/notifications.png"
  },
];

export function WelcomeModal({ open, onComplete, firstName }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const setUser = useAuthStore(state => state.setUser);
  const user = useAuthStore(state => state.user);

  const step = tutorialSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tutorialSteps.length - 1;
  const Icon = step.icon;

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await userService.completeOnboarding();
      if (user) {
        setUser({ ...user, isOnboarded: true });
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
        className="sm:max-w-md p-0 gap-0 overflow-hidden"
        onInteractOutside={e => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Welcome to Spentra</DialogTitle>
          <DialogDescription>A quick tour of Spentra features</DialogDescription>
        </VisuallyHidden>
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isCompleting}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress bar */}
        <div className="w-full h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>

        {/* Image / Placeholder */}
        <div className="w-full h-52 bg-muted relative overflow-hidden">
          {step.image ? (
            <Image
              src={step.image}
              alt={step.title}
              fill
              className="object-cover transition-all duration-300"
            />
          ) : (
            // Placeholder — replace image: null with actual path when ready
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className={`rounded-2xl p-4 ${step.bg}`}>
                <Icon className={`h-10 w-10 ${step.color}`} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ImageIcon className="h-3 w-3" />
                <span>Image placeholder — {step.title}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center gap-5">
          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {isFirst ? `Welcome, ${firstName}!` : step.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {step.description}
            </p>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-4 h-2 bg-primary"
                    : index < currentStep
                      ? "w-2 h-2 bg-primary/40"
                      : "w-2 h-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full">
            {!isFirst && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isCompleting}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}

            <Button
              className="flex-1 flex items-center justify-center gap-2"
              onClick={isLast ? handleComplete : () => setCurrentStep(prev => prev + 1)}
              disabled={isCompleting}
            >
              {isCompleting ? (
                "Setting up..."
              ) : isLast ? (
                "Get Started 🚀"
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Skip link */}
          {!isLast && (
            <button
              onClick={handleSkip}
              disabled={isCompleting}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Skip tutorial
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
