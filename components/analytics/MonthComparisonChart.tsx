"use client";

import { useMemo, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Transaction } from "@/types";
import { groupTransactionsByMonth } from "@/lib/utils/analytics";
import { formatCurrency } from "@/lib/utils/formatting";

type MonthPeriod = 3 | 6 | 12 | 24;

interface MonthComparisonChartProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function MonthComparisonChart({
  transactions,
  loading,
}: MonthComparisonChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [tickColor, setTickColor] = useState<string>("hsl(0, 0%, 45%)");
  const [cursorColor, setCursorColor] = useState<string>("rgba(0, 0, 0, 0.05)");
  const [monthPeriod, setMonthPeriod] = useState<MonthPeriod>(6);

  useEffect(() => {
    const isDark = resolvedTheme === "dark" || theme === "dark";
    setTickColor(isDark ? "hsl(0, 0%, 65%)" : "hsl(0, 0%, 45%)");
    setCursorColor(isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)");
  }, [theme, resolvedTheme]);

  const chartData = useMemo(() => {
    return groupTransactionsByMonth(transactions, monthPeriod);
  }, [transactions, monthPeriod]);

  const totals = useMemo(() => {
    const totalIncome = chartData.reduce((sum, month) => sum + month.income, 0);
    const totalExpenses = chartData.reduce(
      (sum, month) => sum + month.expenses,
      0
    );
    const totalSavings = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, totalSavings };
  }, [chartData]);

  const monthPeriods: { value: MonthPeriod; label: string }[] = [
    { value: 3, label: "3M" },
    { value: 6, label: "6M" },
    { value: 12, label: "1Y" },
    { value: 24, label: "2Y" },
  ];

  const getPeriodLabel = (months: number) => {
    if (months === 12) return "1Y";
    if (months === 24) return "2Y";
    return `${months}mo`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-2xl">Month-over-Month Comparison</CardTitle>
        <div className="flex gap-2">
          {monthPeriods.map(({ value, label }) => (
            <Button
              key={value}
              variant={monthPeriod === value ? "default" : "outline"}
              size="sm"
              onClick={() => setMonthPeriod(value)}
              className="h-8 px-3"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardDescription className="px-6 flex gap-7 text-sm">
        <div>
          <p className="text-muted-foreground">
            Total Income ({getPeriodLabel(monthPeriod)})
          </p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-500">
            {formatCurrency(totals.totalIncome)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">
            Total Expenses ({getPeriodLabel(monthPeriod)})
          </p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-500">
            {formatCurrency(totals.totalExpenses)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">
            Net Savings ({getPeriodLabel(monthPeriod)})
          </p>
          <p
            className={`text-lg font-semibold ${
              totals.totalSavings >= 0
                ? "text-green-600 dark:text-green-500"
                : "text-red-600 dark:text-red-500"
            }`}
          >
            {formatCurrency(totals.totalSavings)}
          </p>
        </div>
      </CardDescription>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No transaction data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 6, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: tickColor }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: tickColor }}
                tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
              />
              <Tooltip
                cursor={{ fill: cursorColor }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                        <p className="text-sm font-medium mb-2">{data.month}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-green-600 dark:text-green-500">
                            Income: {formatCurrency(data.income)}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-500">
                            Expenses: {formatCurrency(data.expenses)}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-500">
                            Savings: {formatCurrency(data.savings)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Savings Rate: {data.savingsRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend iconSize={8} iconType="circle" itemSorter={() => 0} />
              <Bar
                dataKey="income"
                fill="#10b981"
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="#ef4444"
                name="Expenses"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="savings"
                fill="#3b82f6"
                name="Savings"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
