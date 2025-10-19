"use client";

import { useState } from "react";
import { Transaction, TransactionInsert, TransactionUpdate, TransactionType } from "@/types";
import { IncomeFormData, ExpenseFormData } from "@/lib/validations";

interface UseTransactionDialogsProps {
  addTransaction: (data: Omit<TransactionInsert, "user_id">) => Promise<Transaction>;
  updateTransaction: (id: string, updates: TransactionUpdate) => Promise<Transaction>;
  deleteTransaction: (id: string, type: TransactionType) => Promise<void>;
}

interface UseTransactionDialogsReturn {
  incomeDialogOpen: boolean;
  expenseDialogOpen: boolean;
  deleteDialogOpen: boolean;
  setIncomeDialogOpen: (open: boolean) => void;
  setExpenseDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  deletingTransaction: { type: TransactionType; id: string } | null;
  handleAddIncome: () => void;
  handleAddExpense: () => void;
  handleEditTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (transaction: Transaction) => void;
  handleIncomeSubmit: (data: IncomeFormData) => Promise<void>;
  handleExpenseSubmit: (data: ExpenseFormData) => Promise<void>;
  confirmDelete: () => Promise<void>;
}

/**
 * Hook to manage transaction dialog states and handlers
 * Centralizes all dialog-related logic for income, expense, and delete operations
 */
export function useTransactionDialogs({
  addTransaction,
  updateTransaction,
  deleteTransaction,
}: UseTransactionDialogsProps): UseTransactionDialogsReturn {
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<{
    type: TransactionType;
    id: string;
  } | null>(null);

  const handleAddIncome = () => {
    setEditingTransaction(null);
    setIncomeDialogOpen(true);
  };

  const handleAddExpense = () => {
    setEditingTransaction(null);
    setExpenseDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    if (transaction.type === TransactionType.INCOME) {
      setIncomeDialogOpen(true);
    } else {
      setExpenseDialogOpen(true);
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setDeletingTransaction({ type: transaction.type as TransactionType, id: transaction.id });
    setDeleteDialogOpen(true);
  };

  const handleIncomeSubmit = async (data: IncomeFormData) => {
    try {
      if (editingTransaction && editingTransaction.type === TransactionType.INCOME) {
        await updateTransaction(editingTransaction.id, {
          amount: data.amount,
          source: data.source,
          category: data.category || null,
          date: data.date,
          description: data.description || null,
          is_recurring: data.isRecurring || false,
        });
      } else {
        await addTransaction({
          type: TransactionType.INCOME,
          amount: data.amount,
          source: data.source,
          category: data.category || null,
          date: data.date,
          description: data.description || null,
          payment_method: null,
          is_recurring: data.isRecurring || false,
        });
      }
      setEditingTransaction(null);
    } catch (error) {
      throw error;
    }
  };

  const handleExpenseSubmit = async (data: ExpenseFormData) => {
    try {
      if (editingTransaction && editingTransaction.type === TransactionType.EXPENSE) {
        await updateTransaction(editingTransaction.id, {
          amount: data.amount,
          category: data.category,
          payment_method: data.paymentMethod,
          date: data.date,
          description: data.description || null,
          is_recurring: data.isRecurring || false,
        });
      } else {
        await addTransaction({
          type: TransactionType.EXPENSE,
          amount: data.amount,
          category: data.category,
          payment_method: data.paymentMethod,
          date: data.date,
          description: data.description || null,
          is_recurring: data.isRecurring || false,
          source: null,
        });
      }
      setEditingTransaction(null);
    } catch (error) {
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (deletingTransaction) {
      await deleteTransaction(deletingTransaction.id, deletingTransaction.type);
      setDeleteDialogOpen(false);
      setDeletingTransaction(null);
    }
  };

  return {
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
  };
}
