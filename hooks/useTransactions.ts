"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionType,
} from "@/types";
import { createTransactionService } from "@/lib/services/transactions";

export type SortBy = "date" | "amount";
export type SortOrder = "asc" | "desc";

export interface Filters {
  type: "all" | TransactionType;
  sortBy: SortBy;
  sortOrder: SortOrder;
  category?: string;
  recurringOnly?: boolean;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  allTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  setCurrentPage: (page: number) => void;
  refetch: () => void;
  addTransaction: (
    data: Omit<TransactionInsert, "user_id">,
  ) => Promise<Transaction>;
  updateTransaction: (
    id: string,
    updates: TransactionUpdate,
  ) => Promise<Transaction>;
  deleteTransaction: (id: string, type: string) => Promise<void>;
}

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
  });
  const ITEMS_PER_PAGE = 10;

  const supabase = useMemo(() => createClient(), []);
  const transactionService = useMemo(
    () => createTransactionService(supabase),
    [supabase],
  );

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      const userId = userData.user.id;
      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch transactions";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    const setupRealtimeSubscription = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (cancelled || !userData.user) return;
      const userId = userData.user.id;

      const nextChannel = supabase
        .channel(`transactions-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "gargantua",
            table: "transactions",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newTransaction = payload.new as Transaction;
              setTransactions((prev) => [
                newTransaction,
                ...prev.filter((item) => item.id !== newTransaction.id),
              ]);
            } else if (payload.eventType === "UPDATE") {
              const updatedTransaction = payload.new as Transaction;
              setTransactions((prev) =>
                prev.map((t) =>
                  t.id === updatedTransaction.id ? updatedTransaction : t,
                ),
              );
            } else if (payload.eventType === "DELETE") {
              const deletedTransaction = payload.old as Transaction;
              setTransactions((prev) =>
                prev.filter((t) => t.id !== deletedTransaction.id),
              );
            }
          },
        )
        .subscribe();
      if (cancelled) {
        await nextChannel.unsubscribe();
      } else {
        channel = nextChannel;
      }
    };
    void setupRealtimeSubscription();
    return () => {
      cancelled = true;
      if (channel) {
        void channel.unsubscribe();
      }
    };
  }, [supabase]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }
    if (filters.recurringOnly) {
      filtered = filtered.filter((t) => t.is_recurring === true);
    }
    filtered.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });
    return filtered;
  }, [transactions, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE,
  );
  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(Math.max(page, 1), Math.max(totalPages, 1)),
    );
  }, [totalPages]);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    endIndex,
  );

  const addTransaction = useCallback(
    async (data: Omit<TransactionInsert, "user_id">) => {
      const created = await transactionService.addTransaction(data);
      setTransactions((prev) => [
        created,
        ...prev.filter((item) => item.id !== created.id),
      ]);
      return created;
    },
    [transactionService],
  );

  const updateTransaction = useCallback(
    async (id: string, updates: TransactionUpdate) => {
      const updated = await transactionService.updateTransaction(id, updates);
      setTransactions((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      return updated;
    },
    [transactionService],
  );

  const deleteTransaction = useCallback(
    async (id: string, type: string) => {
      await transactionService.deleteTransaction(id, type);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    },
    [transactionService],
  );

  return {
    transactions: paginatedTransactions,
    allTransactions: transactions,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    setFilters,
    setCurrentPage,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
