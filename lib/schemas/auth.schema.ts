import { z } from "zod";

export const step1Schema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
});

export const step2Schema = z.object({
  username: z
    .string()
    .min(1, "Username is required.")
    .min(3, "At least 3 characters.")
    .max(20, "At most 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed."),
});

export const step3BaseSchema = z.object({
  password: z
    .string()
    .min(8, "At least 8 characters.")
    .regex(/[A-Z]/, "One uppercase letter required.")
    .regex(/\d/, "One number required.")
    .regex(/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/, "One special character required."),
  confirmPassword: z.string().min(1, "Confirm your password."),
});

export const step3Schema = step3BaseSchema.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const step4Schema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
});

export const step5Schema = z.object({
  gender: z.string().min(1, "Gender is required."),
});

export const step6Schema = z.object({
  birthday: z.coerce.date({ error: "Birthday is required." }).refine(
    val => {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return val <= eighteenYearsAgo;
    },
    { message: "You must be at least 18 years old." }
  ),
});

export const step7Schema = z.object({
  occupation: z.string().min(1, "Occupation is required."),
});

export const step8Schema = z.object({
  country: z.string().min(1, "Country is required."),
  currency: z.string().min(1, "Currency is required."),
  timezone: z.string().min(1, "Timezone is required."),
});

// 2. Build the schema — no cast needed here
export const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3BaseSchema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema)
  .merge(step8Schema)
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender: string;
  birthday: Date;
  occupation: string;
  country: string;
  currency: string;
  timezone: string;
};
