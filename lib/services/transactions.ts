import { SupabaseClient } from "@supabase/supabase-js";
import { Transaction, TransactionInsert, TransactionUpdate, TransactionType } from "@/types";
import { toast } from "sonner";

/**
 * Service for managing transactions (income and expenses)
 * Provides centralized CRUD operations with auth and error handling
 */
export class TransactionService {
  constructor(private supabase: SupabaseClient) {}

  private async getUserId(): Promise<string> {
    const { data: userData } = await this.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    return userData.user.id;
  }

  async addTransaction(transactionData: Omit<TransactionInsert, "user_id">): Promise<Transaction> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await this.supabase
        .from("transactions")
        .insert([{ ...transactionData, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from insert");

      const typeLabel = transactionData.type === TransactionType.INCOME ? "Income" : "Expense";
      toast.success(`${typeLabel} added successfully`);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add transaction";
      toast.error(message);
      throw err;
    }
  }

  async updateTransaction(id: string, updates: TransactionUpdate): Promise<Transaction> {
    try {
      const { data, error } = await this.supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from update");

      const typeLabel = data.type === TransactionType.INCOME ? "Income" : "Expense";
      toast.success(`${typeLabel} updated successfully`);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update transaction";
      toast.error(message);
      throw err;
    }
  }

  async deleteTransaction(id: string, type: string): Promise<void> {
    try {
      const { error } = await this.supabase.from("transactions").delete().eq("id", id);

      if (error) throw error;

      const typeLabel = type === TransactionType.INCOME ? "Income" : "Expense";
      toast.success(`${typeLabel} deleted successfully`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete transaction";
      toast.error(message);
      throw err;
    }
  }
}

/**
 * Create a transaction service instance
 */
export function createTransactionService(supabase: SupabaseClient) {
  return new TransactionService(supabase);
}
