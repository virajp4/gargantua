import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Transaction, TransactionType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/**
 * Get category color for badges
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    // Expense categories
    food: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    transport: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    entertainment: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
    bills: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    shopping: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300",
    health: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    education: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    travel: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300",
    other: "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300",
    // Priority levels
    high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    low: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    // Recurring
    recurring: "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300",
  };
  return category
    ? colors[category.toLowerCase()]
    : "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300";
}

export type DashboardStats = {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: string;
  savingsRateChange: string;
};

/**
 * Calculate dashboard statistics from transactions
 * Includes comparison with previous month's savings rate
 */
export function calculateDashboardStats(transactions: Transaction[]): DashboardStats {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const prevMonth = subMonths(now, 1);
  const prevMonthStart = startOfMonth(prevMonth);
  const prevMonthEnd = endOfMonth(prevMonth);

  let totalIncome = 0;
  let totalExpenses = 0;
  let monthlyIncome = 0;
  let monthlyExpenses = 0;
  let prevMonthIncome = 0;
  let prevMonthExpenses = 0;

  for (const transaction of transactions) {
    const amount = transaction.amount;
    const date = parseISO(transaction.date);
    const isIncome = transaction.type === TransactionType.INCOME;
    if (isIncome) {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
    }
    if (date >= monthStart && date <= monthEnd) {
      if (isIncome) {
        monthlyIncome += amount;
      } else {
        monthlyExpenses += amount;
      }
    } else if (date >= prevMonthStart && date <= prevMonthEnd) {
      if (isIncome) {
        prevMonthIncome += amount;
      } else {
        prevMonthExpenses += amount;
      }
    }
  }
  const balance = totalIncome - totalExpenses;
  const savingsRate =
    monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const prevSavingsRate =
    prevMonthIncome > 0 ? ((prevMonthIncome - prevMonthExpenses) / prevMonthIncome) * 100 : 0;
  const savingsRateChange = savingsRate - prevSavingsRate;
  return {
    balance,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings: savingsRate.toFixed(2),
    savingsRateChange: savingsRateChange.toFixed(2),
  };
}

/**
 * Calculates the purchase score and affordability status for a wishlist item.
 * Formula Weights:
 * - Necessity: 40%
 * - Priority: 30%
 * - Affordability: 30%
 */
export function calculatePurchaseStatus(
  priority: number,
  necessity: number,
  cost: number,
  balance: number
) {
  const SAFE_SPEND_RATIO = 0.15;
  const safeSpendLimit = balance * SAFE_SPEND_RATIO;
  const isAffordable = balance >= cost;
  const isWithinSafeSpend = cost <= safeSpendLimit;
  const weights = {
    necessity: 0.4,
    priority: 0.3,
    affordability: 0.3,
  };

  const mapRange = (value: number, inMin: number, inMax: number, outMin = 0, outMax = 10) =>
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  const necessityWeight = mapRange(necessity, 1, 5, 2, 10);
  const priorityWeight = mapRange(priority, 1, 3, 3.33, 10);

  const affordabilityWeight =
    cost <= safeSpendLimit ? 10 : Math.max(0, 10 - ((cost - safeSpendLimit) / safeSpendLimit) * 5);

  const purchaseScore = Math.round(
    (necessityWeight * weights.necessity +
      priorityWeight * weights.priority +
      affordabilityWeight * weights.affordability) *
      10
  );

  let status: string;
  let statusColor: string;

  if (!isAffordable) {
    status = "Do Not Open The Hatch";
    statusColor = "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200";
  } else if (!isWithinSafeSpend) {
    status = `Exceeds Gravity Pull: ${formatCurrency(safeSpendLimit)}`;
    statusColor = "bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-200";
  } else if (purchaseScore >= 70) {
    status = "Go For Docking";
    statusColor = "bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-200";
  } else if (purchaseScore >= 40) {
    status = "Slipping Towards Gargantua";
    statusColor = "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200";
  } else {
    status = "Out Of Orbit";
    statusColor = "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200";
  }
  return { purchaseScore, status, statusColor };
}

/**
 * Utility: Get badge color for priority level.
 */
export function getPriorityColor(priority: number): string {
  const colors: Record<number, string> = {
    1: "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300",
    2: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    3: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };
  return colors[priority] ?? colors[1];
}

/**
 * Utility: Get badge color for necessity level.
 */
export function getNecessityColor(necessity: number): string {
  const colors: Record<number, string> = {
    1: "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300",
    2: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    3: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    4: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    5: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };
  return colors[necessity] ?? colors[1];
}
