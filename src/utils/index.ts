import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Recommended: combine with tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
