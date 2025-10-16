import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType } from "@/types";
import { Filters, SortBy, SortOrder } from "@/hooks/useTransactions";

interface TransactionFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function TransactionFilters({ filters, setFilters }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={filters.type}
        onValueChange={(value) => setFilters({ ...filters, type: value as TransactionType })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
          <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortBy}
        onValueChange={(value) => setFilters({ ...filters, sortBy: value as SortBy })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="amount">Amount</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortOrder}
        onValueChange={(value) => setFilters({ ...filters, sortOrder: value as SortOrder })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Descending</SelectItem>
          <SelectItem value="asc">Ascending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
