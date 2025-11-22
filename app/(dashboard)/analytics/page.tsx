"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { SpendingTrendsChart } from "@/components/analytics/SpendingTrendsChart";
import { MonthComparisonChart } from "@/components/analytics/MonthComparisonChart";

export default function AnalyticsPage() {
  const { allTransactions, loading: transactionsLoading } = useTransactions();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize your spending patterns and financial trends
        </p>
      </div>
      <SpendingTrendsChart
        transactions={allTransactions}
        loading={transactionsLoading}
      />
      <MonthComparisonChart
        transactions={allTransactions}
        loading={transactionsLoading}
      />
    </div>
  );
}
