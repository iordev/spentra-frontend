"use client";

import type React from "react";
import { useState } from "react";
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
import { useCheckEmail } from "@/hooks/useCheckEmail";
import axios from "axios";
import { isValidEmail } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export default function MultiStepSignUp() {
  const router = useRouter();
  const { mutateAsync: checkEmail, isPending } = useCheckEmail();
  const [emailError, setEmailError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
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
  });
  // const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmailError(""); // clear error on change
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!formData.email) {
        setEmailError("Email address is required.");
        return;
      }

      try {
        const { exists } = await checkEmail(formData.email);
        if (exists) {
          setEmailError("This email is already registered. Please sign in instead.");
          return;
        }
        // exists === false → clear any old error and proceed
        setEmailError("");
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Something went wrong. Please try again.")
          : "Something went wrong. Please try again.";
        setEmailError(message);
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle final submission
    console.log("Sign up complete:", formData);
    router.push("/overview/dashboard");
  };

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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-8">
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
        <div className="mb-8">
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
            <div className="mb-6">
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
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-input border-border text-foreground placeholder:text-muted-foreground ${
                      emailError ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                    required
                  />
                  {emailError && <p className="text-xs text-destructive">{emailError}</p>}
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
                    name="username"
                    placeholder="john_doe"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
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
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />

                  {/* Password rules */}
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                      • One uppercase letter
                    </li>
                    <li className={/\d/.test(formData.password) ? "text-green-500" : ""}>
                      • One number
                    </li>
                    <li
                      className={
                        /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)
                          ? "text-green-500"
                          : ""
                      }
                    >
                      • One special character
                    </li>
                  </ul>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />

                  {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
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
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-medium text-sm">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-foreground font-medium text-sm">
                      Middle Name
                    </Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      placeholder="Michael"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suffix" className="text-foreground font-medium text-sm">
                      Suffix
                    </Label>
                    <Input
                      id="suffix"
                      name="suffix"
                      placeholder="Jr., Sr., etc."
                      value={formData.suffix}
                      onChange={handleChange}
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
                  <Select
                    value={formData.gender}
                    onValueChange={value => setFormData(prev => ({ ...prev, gender: value }))}
                  >
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
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-foreground font-medium text-sm">
                    Date of Birth
                  </Label>

                  <div className="flex justify-between gap-3">
                    {/* Month Dropdown */}
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="birthMonth" className="text-xs">
                        Month
                      </Label>
                      <Select
                        value={
                          formData.birthday ? (formData.birthday.getMonth() + 1).toString() : ""
                        }
                        onValueChange={month => {
                          const monthNum = parseInt(month);
                          if (formData.birthday) {
                            const newDate = new Date(formData.birthday);
                            newDate.setMonth(monthNum - 1);
                            setFormData(prev => ({ ...prev, birthday: newDate }));
                          } else {
                            // Create a new date with the selected month, default to current year - 18 and day 1
                            const currentYear = new Date().getFullYear();
                            const newDate = new Date(currentYear - 18, monthNum - 1, 1);
                            setFormData(prev => ({ ...prev, birthday: newDate }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent className="max-h-75 overflow-y-auto" position="popper">
                          <SelectItem value="1">January</SelectItem>
                          <SelectItem value="2">February</SelectItem>
                          <SelectItem value="3">March</SelectItem>
                          <SelectItem value="4">April</SelectItem>
                          <SelectItem value="5">May</SelectItem>
                          <SelectItem value="6">June</SelectItem>
                          <SelectItem value="7">July</SelectItem>
                          <SelectItem value="8">August</SelectItem>
                          <SelectItem value="9">September</SelectItem>
                          <SelectItem value="10">October</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Day Dropdown */}
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="birthDay" className="text-xs">
                        Day
                      </Label>
                      <Select
                        value={formData.birthday ? formData.birthday.getDate().toString() : ""}
                        onValueChange={day => {
                          const dayNum = parseInt(day);
                          if (formData.birthday) {
                            const newDate = new Date(formData.birthday);
                            // Check if day is valid for the current month
                            const maxDays = new Date(
                              newDate.getFullYear(),
                              newDate.getMonth() + 1,
                              0
                            ).getDate();
                            const adjustedDay = Math.min(dayNum, maxDays);
                            newDate.setDate(adjustedDay);
                            setFormData(prev => ({ ...prev, birthday: newDate }));
                          } else {
                            // Create a new date with default month (January) and year (current year - 18)
                            const currentYear = new Date().getFullYear();
                            const newDate = new Date(currentYear - 18, 0, dayNum);
                            setFormData(prev => ({ ...prev, birthday: newDate }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto" position="popper">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <SelectItem key={day} value={day.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Year Dropdown */}
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="birthYear" className="text-xs">
                        Year
                      </Label>
                      <Select
                        value={formData.birthday ? formData.birthday.getFullYear().toString() : ""}
                        onValueChange={yearStr => {
                          const year = parseInt(yearStr);
                          if (formData.birthday) {
                            const newDate = new Date(formData.birthday);
                            newDate.setFullYear(year);
                            // Adjust day if necessary (for leap years)
                            const maxDays = new Date(
                              newDate.getFullYear(),
                              newDate.getMonth() + 1,
                              0
                            ).getDate();
                            if (newDate.getDate() > maxDays) {
                              newDate.setDate(maxDays);
                            }
                            setFormData(prev => ({ ...prev, birthday: newDate }));
                          } else {
                            // Create a new date with default month (January) and day 1
                            const newDate = new Date(year, 0, 1);
                            setFormData(prev => ({ ...prev, birthday: newDate }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-75 overflow-y-auto" position="popper">
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

                  {/* Display Selected Date */}
                  {formData.birthday && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          Selected:{" "}
                          <span className="text-primary">
                            {format(formData.birthday, "MMMM d, yyyy")}
                          </span>
                        </p>

                        {/* Optional: Quick Age Display */}
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {Math.floor(
                            (new Date().getTime() - formData.birthday.getTime()) /
                              (365.25 * 24 * 60 * 60 * 1000)
                          )}{" "}
                          years old
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    You must be at least 18 years old to create an account
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
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
                      {/* span wrapper needed — disabled buttons don't fire mouse events */}
                      <span className="flex-1">
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          disabled={
                            currentStep === 1 && (!formData.email || !isValidEmail(formData.email))
                          }
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPending ? "Checking..." : "Next"}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {currentStep === 1 && (!formData.email || !isValidEmail(formData.email)) && (
                      <TooltipContent>
                        <p>
                          {!formData.email
                            ? "Email address is required."
                            : "Please enter a valid email address."}
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
              {currentStep === 6 && (
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Create Account
                </Button>
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
