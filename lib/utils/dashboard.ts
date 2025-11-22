import { parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Transaction, TransactionType } from "@/types";

type DashboardStats = {
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
export function calculateDashboardStats(
  transactions: Transaction[]
): DashboardStats {
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
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;
  const prevSavingsRate =
    prevMonthIncome > 0
      ? ((prevMonthIncome - prevMonthExpenses) / prevMonthIncome) * 100
      : 0;
  const savingsRateChange = savingsRate - prevSavingsRate;
  return {
    balance,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings: savingsRate.toFixed(2),
    savingsRateChange: savingsRateChange.toFixed(2),
  };
}
