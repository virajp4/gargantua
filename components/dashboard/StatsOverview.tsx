import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateDashboardStats, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Wallet, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { Transaction } from "@/types";

interface StatsOverviewProps {
  allTransactions: Transaction[];
  loading: boolean;
}

export function StatsOverview({ allTransactions, loading }: StatsOverviewProps) {
  const { balance, monthlyIncome, monthlyExpenses, monthlySavings, savingsRateChange } =
    calculateDashboardStats(allTransactions);
  const savingsRateChangeValue = parseFloat(savingsRateChange);

  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Current Balance" value={formatCurrency(balance)} Icon={Wallet} />
      <StatsCard
        title="Monthly Income"
        value={formatCurrency(monthlyIncome)}
        Icon={TrendingUp}
        valueClassName="text-green-600 dark:text-green-500"
      />
      <StatsCard
        title="Monthly Expense"
        value={formatCurrency(monthlyExpenses)}
        Icon={TrendingDown}
        valueClassName="text-red-600 dark:text-red-500"
      />
      <StatsCard
        title="Savings"
        value={`${monthlySavings}%`}
        Icon={Percent}
        savingsRateChange={savingsRateChangeValue}
      />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  savingsRateChange?: number;
  valueClassName?: string;
}

function StatsCard({ title, value, Icon, savingsRateChange, valueClassName }: StatsCardProps) {
  const change = savingsRateChange ? Math.abs(savingsRateChange) : 0;
  const isPositive = savingsRateChange ? savingsRateChange >= 0 : false;
  return (
    <Card className="px-5 py-4 gap-3 shadow-sm hover:shadow-md transition-shadow duration-200 border-border/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <div className="flex items-end gap-2">
        <p className={cn("text-2xl font-semibold tracking-tight", valueClassName)}>{value}</p>
        {savingsRateChange !== undefined && (
          <p
            className={cn(
              "text-sm font-medium pb-0.5",
              isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
            )}
          >
            {isPositive ? "+" : "-"}
            {change}%
          </p>
        )}
      </div>
    </Card>
  );
}
