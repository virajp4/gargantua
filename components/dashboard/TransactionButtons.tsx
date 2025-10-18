import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface TransactionButtonsProps {
  handleAddIncome: () => void;
  handleAddExpense: () => void;
}

export default function TransactionButtons({
  handleAddIncome,
  handleAddExpense,
}: TransactionButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-2.5 flex-wrap">
      <h2 className="text-xl font-semibold">All Transactions</h2>
      <div className="flex gap-2">
        <Button onClick={handleAddIncome} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
        <Button onClick={handleAddExpense} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>
    </div>
  );
}
