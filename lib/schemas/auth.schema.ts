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

// infer types from schemas
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;

// Combined type for the whole form
export type SignUpFormData = Step1Data & Step2Data & Step3Data & Step4Data & Step5Data & Step6Data;
