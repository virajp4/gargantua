import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Handles conditional classes and ensures proper Tailwind precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
