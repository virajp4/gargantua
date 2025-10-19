import { TransactionType } from "@/types";
import { Filters, SortBy } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  DollarSign,
  Wallet,
  TrendingUp,
  TrendingDown,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function TransactionFilters({ filters, setFilters }: TransactionFiltersProps) {
  const handleSortToggle = (sortBy: SortBy) => {
    if (filters.sortBy === sortBy) {
      setFilters({
        ...filters,
        sortOrder: filters.sortOrder === "desc" ? "asc" : "desc",
      });
    } else {
      setFilters({ ...filters, sortBy, sortOrder: "desc" });
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        <Button
          variant={filters.type === "all" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setFilters({ ...filters, type: "all" })}
          className={cn(
            "transition-all duration-200 h-8 w-8",
            filters.type === "all" &&
              "shadow-sm bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 hover:bg-blue-100 hover:dark:bg-blue-900/30"
          )}
          aria-label="All transactions"
        >
          <Wallet className="h-4 w-4" />
        </Button>
        <Button
          variant={filters.type === TransactionType.INCOME ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setFilters({ ...filters, type: TransactionType.INCOME })}
          className={cn(
            "transition-all duration-200 h-8 w-8",
            filters.type === TransactionType.INCOME &&
              "shadow-sm bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 hover:bg-green-100 hover:dark:bg-green-900/30"
          )}
          aria-label="Income transactions"
        >
          <TrendingUp className="h-4 w-4" />
        </Button>
        <Button
          variant={filters.type === TransactionType.EXPENSE ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setFilters({ ...filters, type: TransactionType.EXPENSE })}
          className={cn(
            "transition-all duration-200 h-8 w-8",
            filters.type === TransactionType.EXPENSE &&
              "shadow-sm bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 hover:bg-red-100 hover:dark:bg-red-900/30"
          )}
          aria-label="Expense transactions"
        >
          <TrendingDown className="h-4 w-4" />
        </Button>
        <Button
          variant={filters.recurringOnly ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setFilters({ ...filters, recurringOnly: !filters.recurringOnly })}
          className={cn(
            "transition-all duration-200 h-8 w-8",
            filters.recurringOnly &&
              "shadow-sm bg-teal-100 dark:bg-teal-900/30 text-teal-900 dark:text-teal-200 hover:bg-teal-100 hover:dark:bg-teal-900/30"
          )}
          aria-label="Recurring transactions only"
        >
          <Repeat className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={filters.sortBy === "date" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleSortToggle("date")}
          className={cn(
            "gap-1.5 transition-all duration-200",
            filters.sortBy === "date" && "shadow-sm"
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          Date
          {filters.sortBy === "date" &&
            (filters.sortOrder === "desc" ? (
              <ArrowDownAZ className="h-3.5 w-3.5 transition-transform duration-200" />
            ) : (
              <ArrowUpAZ className="h-3.5 w-3.5 transition-transform duration-200" />
            ))}
        </Button>
        <Button
          variant={filters.sortBy === "amount" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleSortToggle("amount")}
          className={cn(
            "gap-1.5 transition-all duration-200",
            filters.sortBy === "amount" && "shadow-sm"
          )}
        >
          <DollarSign className="h-3.5 w-3.5" />
          Amount
          {filters.sortBy === "amount" &&
            (filters.sortOrder === "desc" ? (
              <ArrowDownAZ className="h-3.5 w-3.5 transition-transform duration-200" />
            ) : (
              <ArrowUpAZ className="h-3.5 w-3.5 transition-transform duration-200" />
            ))}
        </Button>
      </div>
    </div>
  );
}
