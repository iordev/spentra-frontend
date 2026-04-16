"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCheckEmail, useCheckUsername } from "@/hooks/useAuth";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  SignUpFormData,
  step1Schema,
  step2Schema,
  step3BaseSchema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
} from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignUpData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  gender: string;
  birthday: Date | undefined;
}

const steps = [
  {
    title: "Enter Your Email",
    description: "We'll use this to verify your account",
  },
  {
    title: "Choose Your Username",
    description: "Create a unique username for your account",
  },
  {
    title: "Create a Password",
    description: "Make it strong and secure",
  },
  {
    title: "Your Full Name",
    description: "Help us personalize your experience",
  },
  {
    title: "Tell Us About You",
    description: "Gender information",
  },
  {
    title: "Your Birthday",
    description: "Complete your profile setup",
  },
];

export const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3BaseSchema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function MultiStepSignUp() {
  // 1. hooks
  const router = useRouter();
  const { mutateAsync: checkEmail, isPending: isCheckingEmail } = useCheckEmail();
  const { mutateAsync: checkUsername, isPending: isCheckingUsername } = useCheckUsername();

  // 2. react hook form
  const {
    register,
    trigger,
    control,
    setError,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      gender: "",
      birthday: undefined,
    },
  });

  // 3. state
  const [currentStep, setCurrentStep] = useState(1);

  // const [agreedToTerms, setAgreedToTerms] = useState(false);

  const email = useWatch({ control, name: "email" }) ?? "";
  const password = useWatch({ control, name: "password" }) ?? "";
  const confirmPassword = useWatch({ control, name: "confirmPassword" }) ?? "";

  // 3. static data (no need to re-declare on every render, move outside component)
  // see below

  // 4. helpers
  const getErrorMessage = (error: unknown) =>
    axios.isAxiosError(error)
      ? (error.response?.data?.message ?? "Something went wrong. Please try again.")
      : "Something went wrong. Please try again.";

  // 5. validators
  const validateStep1 = async (): Promise<boolean> => {
    const isValid = await trigger("email");
    if (!isValid) return false;

    try {
      const { exists } = await checkEmail(getValues("email"));
      if (exists) {
        setError("email", { message: "This email is already registered. Please sign in instead." });
        return false;
      }
      return true;
    } catch (error) {
      setError("email", { message: getErrorMessage(error) });
      return false;
    }
  };

  const validateStep2 = async (): Promise<boolean> => {
    const isValid = await trigger("username");
    if (!isValid) return false;

    try {
      const { exists } = await checkUsername(getValues("username"));
      if (exists) {
        setError("username", { message: "This username is already taken. Please choose another." });
        return false;
      }
      return true;
    } catch (error) {
      setError("username", { message: getErrorMessage(error) });
      return false;
    }
  };

  const validateStep3 = async (): Promise<boolean> => {
    return await trigger(["password", "confirmPassword"]);
  };

  const validateStep4 = async (): Promise<boolean> => {
    return await trigger(["firstName", "lastName"]);
  };

  const validateStep5 = async (): Promise<boolean> => {
    return await trigger("gender");
  };

  const validateStep6 = async (): Promise<boolean> => {
    return await trigger("birthday");
  };

  const stepValidators: Record<number, () => Promise<boolean>> = {
    1: validateStep1,
    2: validateStep2,
    3: validateStep3,
    4: validateStep4,
    5: validateStep5,
    6: validateStep6,
  };

  const stepSchemas: Record<number, z.ZodTypeAny> = {
    1: step1Schema,
    2: step2Schema,
    3: step3Schema, // includes the .refine for password match
    4: step4Schema,
    5: step5Schema,
    6: step6Schema,
  };

  const watchedValues = useWatch({ control });

  const isStepValid = useMemo(() => {
    const schema = stepSchemas[currentStep];
    if (!schema) return true;
    return schema.safeParse(watchedValues).success;
  }, [watchedValues, currentStep]);

  const stepTooltipMessage: Record<number, string> = {
    1: !email ? "Email address is required." : "Please enter a valid email address.",
    2: "Username is required.",
    3: !password
      ? "Password is required."
      : confirmPassword !== password
        ? "Passwords do not match."
        : "Please meet all password requirements.",
    4: "First and Last name are required.",
    5: "Gender is required.",
    6: !watchedValues.birthday
      ? "Date of birth is required."
      : "You must be at least 18 years old.",
  };

  // 6. handlers
  const handleNextStep = async () => {
    const validate = stepValidators[currentStep];
    if (validate) {
      const isValid = await validate();
      if (!isValid) return;
    }
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle final submission
    console.log("Sign up complete:", getValues());
    router.push("/overview/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-4">
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
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Start your journey to financial freedom</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index < currentStep
                    ? "bg-primary"
                    : index === currentStep - 1
                      ? "bg-primary"
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-card border border-border p-8 shadow-sm">
          <form onSubmit={currentStep === 6 ? handleSubmit : e => e.preventDefault()}>
            {/* Step Title */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground">{steps[currentStep - 1].title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Step 1: Email */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    {...register("email")}
                    className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive focus-visible:ring-offset-background"
                        : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Username */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground font-medium text-sm">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="john_doe"
                    {...register("username")}
                    className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
                      errors.username
                        ? "border-destructive focus-visible:ring-destructive focus-visible:ring-offset-background"
                        : ""
                    }`}
                    required
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive">{errors.username.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Password */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium text-sm">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive focus-visible:ring-offset-background"
                        : ""
                    }`}
                    required
                  />

                  {/* Password rules */}
                  <ul className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                    <li
                      className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-500" : "text-muted-foreground"}`}
                    >
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                      • One uppercase letter
                    </li>
                    <li className={/\d/.test(password) ? "text-green-500" : ""}>• One number</li>
                    <li
                      className={
                        /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>\/]/.test(password)
                          ? "text-green-500"
                          : ""
                      }
                    >
                      • One special character
                    </li>
                  </ul>
                  <p className="text-xs text-destructive min-h-2">
                    {errors.password?.message ?? ""}
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
                      errors.confirmPassword
                        ? "border-destructive focus-visible:ring-destructive focus-visible:ring-offset-background"
                        : ""
                    }`}
                  />

                  {/* Reserved space for error */}
                  <p className="text-xs text-destructive min-h-2">
                    {confirmPassword && confirmPassword !== password
                      ? "Passwords do not match"
                      : errors.confirmPassword && confirmPassword === password
                        ? errors.confirmPassword.message
                        : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Full Name */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-medium text-sm">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
                        errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-medium text-sm">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
                        errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-foreground font-medium text-sm">
                      Middle Name
                    </Label>
                    <Input
                      id="middleName"
                      placeholder="Michael"
                      {...register("middleName")}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suffix" className="text-foreground font-medium text-sm">
                      Suffix
                    </Label>
                    <Input
                      id="suffix"
                      placeholder="Jr., Sr., etc."
                      {...register("suffix")}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Gender */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-foreground font-medium text-sm">
                    Gender
                  </Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full bg-input border-border">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-destructive text-sm">{errors.gender.message}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">Date of Birth</Label>

                  <Controller
                    control={control}
                    name="birthday"
                    render={({ field }) => {
                      const date =
                        field.value instanceof Date && !isNaN(field.value.getTime())
                          ? field.value
                          : null;

                      const updateDate = (type: "month" | "day" | "year", value: number) => {
                        const base = date ?? new Date(new Date().getFullYear() - 18, 0, 1);
                        const newDate = new Date(base);

                        if (type === "month") newDate.setMonth(value - 1);
                        if (type === "day") newDate.setDate(value);
                        if (type === "year") newDate.setFullYear(value);

                        // Clamp day to valid range for the month
                        const maxDays = new Date(
                          newDate.getFullYear(),
                          newDate.getMonth() + 1,
                          0
                        ).getDate();
                        if (newDate.getDate() > maxDays) newDate.setDate(maxDays);

                        field.onChange(newDate);
                      };

                      return (
                        <>
                          <div className="flex justify-between gap-3">
                            {/* Month */}
                            <div className="flex-1 space-y-2">
                              <Label className="text-xs">Month</Label>
                              <Select
                                value={date ? (date.getMonth() + 1).toString() : ""}
                                onValueChange={v => updateDate("month", parseInt(v))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent
                                  className="max-h-75 overflow-y-auto"
                                  position="popper"
                                >
                                  {[
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December",
                                  ].map((month, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Day */}
                            <div className="flex-1 space-y-2">
                              <Label className="text-xs">Day</Label>
                              <Select
                                value={date ? date.getDate().toString() : ""}
                                onValueChange={v => updateDate("day", parseInt(v))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Day" />
                                </SelectTrigger>
                                <SelectContent
                                  className="max-h-75 overflow-y-auto"
                                  position="popper"
                                >
                                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <SelectItem key={day} value={day.toString()}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Year */}
                            <div className="flex-1 space-y-2">
                              <Label className="text-xs">Year</Label>
                              <Select
                                value={date ? date.getFullYear().toString() : ""}
                                onValueChange={v => updateDate("year", parseInt(v))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent
                                  className="max-h-75 overflow-y-auto"
                                  position="popper"
                                >
                                  {Array.from({ length: 100 }, (_, i) => {
                                    const year = new Date().getFullYear() - 18 - i;
                                    return (
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Selected date display */}
                          {date && (
                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  Selected:{" "}
                                  <span className="text-primary">
                                    {format(date, "MMMM d, yyyy")}
                                  </span>
                                </p>
                                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {Math.floor(
                                    (new Date().getTime() - date.getTime()) /
                                      (365.25 * 24 * 60 * 60 * 1000)
                                  )}{" "}
                                  years old
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    }}
                  />

                  {errors.birthday && (
                    <p className="text-destructive text-sm">{errors.birthday.message}</p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    You must be at least 18 years old to create an account
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                >
                  Back
                </Button>
              )}
              {currentStep < 6 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex-1">
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          disabled={!isStepValid}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCheckingEmail || isCheckingUsername ? "Checking..." : "Next"}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isStepValid && (
                      <TooltipContent>
                        <p>{stepTooltipMessage[currentStep]}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}

              {currentStep === 6 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex-1">
                        <Button
                          type="submit"
                          disabled={!isStepValid}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          Create Account
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isStepValid && (
                      <TooltipContent>
                        <p>{stepTooltipMessage[6]}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/" className="text-primary hover:text-primary/90 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
