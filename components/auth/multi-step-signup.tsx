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
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useCheckEmail,
  useCheckUsername,
  useGetCountries,
  useGetCurrencies,
  useGetOccupations,
  useGetTimezones,
} from "@/hooks/useAuth";
import { Controller, Resolver, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  fullSchema,
  type SignUpFormData,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
} from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OAuthRegisterDto, RegisterDto } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const stepTitles: Record<number, { title: string; description: string }> = {
  1: { title: "Enter Your Email", description: "We'll use this to verify your account" },
  2: { title: "Choose Your Username", description: "Create a unique username for your account" },
  3: { title: "Create a Password", description: "Make it strong and secure" },
  4: { title: "Your Full Name", description: "Help us personalize your experience" },
  5: { title: "Tell Us About You", description: "Gender information" },
  6: { title: "Your Birthday", description: "Complete your profile setup" },
  7: { title: "Occupation", description: "Tell us what you do" },
  8: { title: "Set Your Preferences", description: "Select your country, currency, and timezone" },
};

const stepSchemas: Record<number, z.ZodTypeAny> = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema, // includes the .refine for password match
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: step7Schema,
  8: step8Schema,
};

export default function MultiStepSignUp() {
  // 1. hooks
  const router = useRouter();
  const { mutateAsync: checkEmail, isPending: isCheckingEmail } = useCheckEmail();
  const { mutateAsync: checkUsername, isPending: isCheckingUsername } = useCheckUsername();

  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const isOAuth = !!provider;

  // Pre-fill from OAuth query params
  const oauthEmail = searchParams.get("email") ?? "";
  const oauthFirstName = searchParams.get("firstName") ?? "";
  const oauthLastName = searchParams.get("lastName") ?? "";
  const oauthAvatarUrl = searchParams.get("avatarUrl") ?? "";

  const regularSteps = [1, 2, 3, 4, 5, 6, 7, 8];
  const oauthSteps = [2, 5, 6, 7, 8];
  const activeSteps = isOAuth ? oauthSteps : regularSteps;
  const totalSteps = activeSteps.length;

  const [currentStep, setCurrentStep] = useState(() => activeSteps[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const currentStepIndex = activeSteps.indexOf(currentStep);

  const { data: occupationsData, isLoading: isLoadingOccupations } = useGetOccupations(
    currentStep === 7
  );
  const { data: countriesData, isLoading: isLoadingCountries } = useGetCountries(currentStep === 8);
  const { data: currenciesData, isLoading: isLoadingCurrencies } = useGetCurrencies(
    currentStep === 8
  );
  const { data: timezonesData, isLoading: isLoadingTimezones } = useGetTimezones(currentStep === 8);

  const occupations = (occupationsData ?? []).map(o => ({ label: o.name, value: String(o.id) }));
  const countries = (countriesData ?? []).map(c => ({
    label: c.name,
    value: String(c.id),
    code: c.code,
  }));
  const currencies = (currenciesData ?? []).map(c => ({
    label: c.name,
    value: String(c.id),
    symbol: c.symbol,
  }));
  const timezones = (timezonesData ?? []).map(t => ({ label: t.name, value: String(t.id) }));

  // 2. react hook form
  const {
    register,
    trigger,
    control,
    setError,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(fullSchema) as Resolver<SignUpFormData>, // ✅ cast here only
    defaultValues: {
      email: oauthEmail,
      username: "",
      password: "",
      confirmPassword: "",
      firstName: oauthFirstName,
      middleName: "",
      lastName: oauthLastName,
      suffix: "",
      gender: "",
      birthday: undefined,
      occupationId: undefined,
      countryId: undefined,
      currencyId: undefined,
      timezoneId: undefined,
    },
  });
  // 3. state

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

  const validateStep7 = async (): Promise<boolean> => {
    return await trigger("occupationId");
  };

  const validateStep8 = async (): Promise<boolean> => {
    return await trigger(["countryId", "currencyId", "timezoneId"]);
  };

  const stepValidators: Record<number, () => Promise<boolean>> = {
    1: validateStep1,
    2: validateStep2,
    3: validateStep3,
    4: validateStep4,
    5: validateStep5,
    6: validateStep6,
    7: validateStep7,
    8: validateStep8,
  };

  const watchedValues = useWatch({ control });

  const isStepValid = useMemo(() => {
    const schema = stepSchemas[currentStep];
    if (!schema) return true;
    const result = schema.safeParse(watchedValues);
    return result.success;
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
    7: "Occupation is required.",
    8: "Country, Currency, and Timezone are required.",
  };

  // 6. handlers
  const handleNextStep = async () => {
    const validate = stepValidators[currentStep];
    if (validate) {
      const isValid = await validate();
      if (!isValid) return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < totalSteps) {
      setCurrentStep(activeSteps[nextIndex]);
    }
  };

  const handlePreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(activeSteps[prevIndex]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();

    try {
      setIsLoading(true);
      setServerError("");
      if (isOAuth) {
        const dto: OAuthRegisterDto = {
          email: oauthEmail,
          username: values.username,
          firstName: oauthFirstName,
          lastName: oauthLastName,
          avatarUrl: oauthAvatarUrl || undefined,
          gender: values.gender,
          birthDate: values.birthday.toISOString(),
          occupationId: values.occupationId!,
          countryId: values.countryId!,
          currencyId: values.currencyId!,
          timezoneId: values.timezoneId!,
          provider: provider!,
        };
        const response = await authService.oauthRegister(dto);
        useAuthStore.getState().setUser(response);
        router.push("/overview/dashboard");
      } else {
        const dto: RegisterDto = {
          email: values.email,
          username: values.username,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName,
          suffix: values.suffix,
          gender: values.gender,
          birthDate: values.birthday.toISOString(),
          occupationId: values.occupationId!,
          countryId: values.countryId!,
          currencyId: values.currencyId!,
          timezoneId: values.timezoneId!,
        };
        await authService.register(dto);
        router.push(`/verify-email?email=${values.email}`);
      }
    } catch (error) {
      setServerError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Something went wrong. Please try again.")
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-2 sm:py-4">
      {/* Top bar: back button left, mode toggle right */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/public">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </Button>
        <ModeToggle />
      </div>

      <div className="w-full max-w-md pt-5 sm:pt-20">
        {/* Header */}
        <div className="mb-4 sm:mb-8 text-center">
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
            {activeSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index < currentStepIndex
                    ? "bg-primary"
                    : index === currentStepIndex
                      ? "bg-primary"
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-card border border-border p-8 shadow-sm">
          <form
            onSubmit={currentStepIndex === totalSteps - 1 ? handleSubmit : e => e.preventDefault()}
          >
            {/* Step Title */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground">{stepTitles[currentStep].title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {stepTitles[currentStep].description}
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
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
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

            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">Occupation</Label>

                  <Controller
                    control={control}
                    name="occupationId"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={val => field.onChange(Number(val))}
                        disabled={isLoadingOccupations}
                      >
                        <SelectTrigger className="w-full bg-input border-border">
                          <SelectValue
                            placeholder={
                              isLoadingOccupations ? "Loading..." : "Select your occupation"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent className="max-h-75 overflow-y-auto" position="popper">
                          {occupations?.map(o => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.occupationId && (
                    <p className="text-destructive text-sm">{errors.occupationId.message}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-4">
                {/* Country */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">Country</Label>
                  <Controller
                    control={control}
                    name="countryId"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={val => field.onChange(Number(val))}
                        disabled={isLoadingCountries}
                      >
                        <SelectTrigger className="w-full bg-input border-border">
                          <SelectValue
                            placeholder={isLoadingCountries ? "Loading..." : "Select your country"}
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-75 overflow-y-auto" position="popper">
                          {countries.map(c => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label} ({c.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.countryId && (
                    <p className="text-destructive text-sm">{errors.countryId.message}</p>
                  )}
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">Preferred Currency</Label>
                  <Controller
                    control={control}
                    name="currencyId"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={val => field.onChange(Number(val))}
                        disabled={isLoadingCurrencies}
                      >
                        <SelectTrigger className="w-full bg-input border-border">
                          <SelectValue
                            placeholder={
                              isLoadingCurrencies ? "Loading..." : "Select your currency"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-75 overflow-y-auto" position="popper">
                          {currencies.map(c => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label} ({c.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currencyId && (
                    <p className="text-destructive text-sm">{errors.currencyId.message}</p>
                  )}
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm">Timezone</Label>
                  <Controller
                    control={control}
                    name="timezoneId"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={val => field.onChange(Number(val))}
                        disabled={isLoadingTimezones}
                      >
                        <SelectTrigger className="w-full bg-input border-border">
                          <SelectValue
                            placeholder={isLoadingTimezones ? "Loading..." : "Select your timezone"}
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-75 overflow-y-auto" position="popper">
                          {timezones.map(t => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.timezoneId && (
                    <p className="text-destructive text-sm">{errors.timezoneId.message}</p>
                  )}
                </div>
              </div>
            )}

            {currentStepIndex === totalSteps - 1 && serverError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-start gap-3 mt-4">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-destructive">Registration failed.</p>
                  <p className="text-sm text-destructive/80">{serverError}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStepIndex > 0 && (
                <div className="flex-1">
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    Back
                  </Button>
                </div>
              )}

              {currentStepIndex < totalSteps - 1 && (
                <div className="flex-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="block w-full">
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
                </div>
              )}

              {currentStepIndex === totalSteps - 1 && (
                <div className="flex-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="block w-full">
                          <Button
                            type="submit"
                            disabled={!isStepValid || isLoading}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              "Create Account"
                            )}
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
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:text-primary/90 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
