import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  eachMonthOfInterval,
} from "date-fns";
import { Transaction, TransactionType } from "@/types";

type MonthlyData = {
  month: string; // e.g., "Jan 2024"
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number; // percentage
};

/**
 * Group transactions by month for the specified number of months
 */
export function groupTransactionsByMonth(
  transactions: Transaction[],
  monthsCount: number = 6
): MonthlyData[] {
  const now = new Date();
  const months = eachMonthOfInterval({
    start: subMonths(now, monthsCount - 1),
    end: now,
  });

  return months.map((monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    let income = 0;
    let expenses = 0;

    for (const transaction of transactions) {
      const date = parseISO(transaction.date);
      if (date >= monthStart && date <= monthEnd) {
        if (transaction.type === TransactionType.INCOME) {
          income += transaction.amount;
        } else {
          expenses += transaction.amount;
        }
      }
    }

    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      month: format(monthDate, "MMM yyyy"),
      income,
      expenses,
      savings,
      savingsRate,
    };
  });
}

/**
 * Group transactions by day for time period (for trends chart)
 */
export function groupTransactionsByDay(
  transactions: Transaction[],
  days: number = 30
): { date: string; income: number; expenses: number }[] {
  const now = new Date();
  const startDate = subDays(now, days);

  // Create a map of all dates in range
  const dateMap = new Map<string, { income: number; expenses: number }>();

  for (let i = 0; i <= days; i++) {
    const date = subDays(now, i);
    const dateStr = format(date, "yyyy-MM-dd");
    dateMap.set(dateStr, { income: 0, expenses: 0 });
  }

  // Fill in transaction data
  for (const transaction of transactions) {
    const transDate = parseISO(transaction.date);
    if (transDate >= startDate && transDate <= now) {
      const dateStr = format(transDate, "yyyy-MM-dd");
      const existing = dateMap.get(dateStr);
      if (existing) {
        if (transaction.type === TransactionType.INCOME) {
          existing.income += transaction.amount;
        } else {
          existing.expenses += transaction.amount;
        }
      }
    }
  }

  // Convert to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date: format(parseISO(date), "MMM dd"),
      ...data,
    }))
    .reverse(); // Oldest to newest
}
