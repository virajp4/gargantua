"use client";

import { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Transaction } from "@/types";
import { groupTransactionsByDay } from "@/lib/utils/analytics";
import { formatCurrency } from "@/lib/utils/formatting";

type TimePeriod = 30 | 90 | 180 | 365;

interface SpendingTrendsChartProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function SpendingTrendsChart({
  transactions,
  loading,
}: SpendingTrendsChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [tickColor, setTickColor] = useState<string>("hsl(0, 0%, 45%)");
  const [cursorColor, setCursorColor] = useState<string>("rgba(0, 0, 0, 0.05)");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(30);

  useEffect(() => {
    const isDark = resolvedTheme === "dark" || theme === "dark";
    setTickColor(isDark ? "hsl(0, 0%, 65%)" : "hsl(0, 0%, 45%)");
    setCursorColor(isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)");
  }, [theme, resolvedTheme]);

  const chartData = useMemo(() => {
    return groupTransactionsByDay(transactions, timePeriod);
  }, [transactions, timePeriod]);

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: 30, label: "30D" },
    { value: 90, label: "90D" },
    { value: 180, label: "6M" },
    { value: 365, label: "1Y" },
  ];

  // Calculate X-axis interval based on time period to avoid cluttering
  // interval = 0 means show all ticks, interval = 1 means show every 2nd tick (every 2 days)
  const xAxisInterval = useMemo(() => {
    if (chartData.length === 0) return 0;
    if (timePeriod === 30) return 1; // Show every 2 days for 30 days
    if (timePeriod === 90) {
      // Show approximately 8-10 ticks for 90 days
      const desiredTicks = 8;
      return Math.max(1, Math.floor(chartData.length / desiredTicks));
    }
    if (timePeriod === 180) {
      // Show approximately 6-8 ticks for 6 months
      const desiredTicks = 6;
      return Math.max(1, Math.floor(chartData.length / desiredTicks));
    }
    if (timePeriod === 365) {
      // Show approximately 12 ticks for 1 year (monthly)
      const desiredTicks = 12;
      return Math.max(1, Math.floor(chartData.length / desiredTicks));
    }
    return 0;
  }, [timePeriod, chartData.length]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl">Spending Trends Over Time</CardTitle>
        <div className="flex gap-2">
          {timePeriods.map(({ value, label }) => (
            <Button
              key={value}
              variant={timePeriod === value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod(value)}
              className="h-8 px-3"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No transaction data available for this period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 6, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: tickColor }}
                interval={xAxisInterval}
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
                        <p className="text-sm font-medium mb-2">{data.date}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-green-600 dark:text-green-500">
                            Income: {formatCurrency(data.income)}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-500">
                            Expenses: {formatCurrency(data.expenses)}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend iconSize={8} iconType="circle" itemSorter={() => 0} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorIncome)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#colorExpenses)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
