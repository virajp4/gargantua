import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate, getCategoryColor } from "@/lib/utils";
import { Pencil, Trash2, Repeat, ChevronLeft, ChevronRight } from "lucide-react";
import { Transaction, TransactionType } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  loading,
  currentPage,
  totalPages,
  setCurrentPage,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }
  if (transactions.length === 0) {
    return (
      <p className="text-muted-foreground">
        No transactions yet. Start by adding income or expenses.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead className="w-[120px] text-right">Amount</TableHead>
            <TableHead className="w-[160px]">Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description || "-"}</TableCell>
              <TableCell
                className={cn(
                  "font-semibold text-right",
                  transaction.type === TransactionType.INCOME ? "text-green-600" : "text-red-600"
                )}
              >
                {transaction.type === TransactionType.INCOME ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <div className="flex gap-1.5 items-center">
                  <Badge className={getCategoryColor(transaction.category || "")}>
                    {transaction.category || "-"}
                  </Badge>
                  {transaction.is_recurring && (
                    <Badge className={cn("py-1", getCategoryColor("recurring"))}>
                      <Repeat className="h-4 w-4" />
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}>
                    <Trash2 className="text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
