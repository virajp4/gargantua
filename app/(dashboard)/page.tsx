"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionDialogs } from "@/hooks/useTransactionDialogs";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { TransactionFilters } from "@/components/dashboard/TransactionFilters";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { WishlistCard } from "@/components/dashboard/WishlistCard";
import { IncomeDialog } from "@/components/dialogs/IncomeDialog";
import { ExpenseDialog } from "@/components/dialogs/ExpenseDialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/DeleteConfirmationDialog";
import { Card } from "@/components/ui/card";
import { TransactionType } from "@/types";
import { calculateDashboardStats } from "@/lib/utils";
import TransactionButtons from "@/components/dashboard/TransactionButtons";

export default function DashboardPage() {
  const {
    transactions,
    allTransactions,
    loading,
    currentPage,
    totalPages,
    filters,
    setFilters,
    setCurrentPage,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const {
    incomeDialogOpen,
    expenseDialogOpen,
    deleteDialogOpen,
    setIncomeDialogOpen,
    setExpenseDialogOpen,
    setDeleteDialogOpen,
    editingTransaction,
    deletingTransaction,
    handleAddIncome,
    handleAddExpense,
    handleEditTransaction,
    handleDeleteTransaction,
    handleIncomeSubmit,
    handleExpenseSubmit,
    confirmDelete,
  } = useTransactionDialogs({
    addTransaction,
    updateTransaction,
    deleteTransaction,
  });
  const stats = calculateDashboardStats(allTransactions);
  // TODO: Add a max-w-3xl after adding analytics to the table card
  return (
    <div className="flex flex-col gap-6">
      <StatsOverview allTransactions={allTransactions} loading={loading} />
      <Card className="p-4 flex flex-col gap-4">
        <TransactionButtons handleAddIncome={handleAddIncome} handleAddExpense={handleAddExpense} />
        <TransactionFilters filters={filters} setFilters={setFilters} />
        <TransactionsTable
          transactions={transactions}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </Card>
      <WishlistCard balance={stats.balance} />
      <IncomeDialog
        open={incomeDialogOpen}
        onOpenChange={setIncomeDialogOpen}
        onSubmit={handleIncomeSubmit}
        editData={
          editingTransaction?.type === TransactionType.INCOME ? editingTransaction : undefined
        }
      />
      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onSubmit={handleExpenseSubmit}
        editData={
          editingTransaction?.type === TransactionType.EXPENSE ? editingTransaction : undefined
        }
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={`Delete ${
          deletingTransaction?.type === TransactionType.INCOME ? "Income" : "Expense"
        }`}
        description={`Are you sure you want to delete this ${deletingTransaction?.type} entry? This action cannot be undone.`}
      />
    </div>
  );
}
