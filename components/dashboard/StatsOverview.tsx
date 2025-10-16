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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Current Balance" value={formatCurrency(balance)} Icon={Wallet} />
      <StatsCard
        title="Monthly Income"
        value={formatCurrency(monthlyIncome)}
        Icon={TrendingUp}
        valueClassName="text-green-600"
      />
      <StatsCard
        title="Monthly Expense"
        value={formatCurrency(monthlyExpenses)}
        Icon={TrendingDown}
        valueClassName="text-red-600"
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
    <Card className="px-4 py-3 gap-3">
      <div className="flex items-center justify-between">
        <p className="text-md font-medium text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex items-end gap-3">
        <p className={cn("text-2xl font-bold", valueClassName)}>{value}</p>
        {savingsRateChange && (
          <p className={cn("text-md font-bold", isPositive ? "text-green-600" : "text-red-600")}>
            {isPositive ? "+" : "-"}
            {change}%
          </p>
        )}
      </div>
    </Card>
  );
}
