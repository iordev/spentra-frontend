import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimezoneOffset = (timezoneName: string): string => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezoneName,
      timeZoneName: "shortOffset",
    });

    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(p => p.type === "timeZoneName")?.value ?? "";

    return offsetPart.replace("GMT", "UTC");
  } catch {
    return "";
  }
};
