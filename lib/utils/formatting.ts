import { format, parseISO } from "date-fns";

/**
 * Format currency with INR symbol
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format date string in dd-MM-yy format
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "MMMM dd, yyyy");
  } catch {
    return dateString;
  }
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}
