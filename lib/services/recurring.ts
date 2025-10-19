import { SupabaseClient } from "@supabase/supabase-js";
import { TransactionInsert } from "@/types";
import { differenceInMonths, startOfMonth, endOfMonth } from "date-fns";

/**
 * Check for recurring transactions and auto-create missing ones
 * Logic:
 * 1. Fetch all transactions where is_recurring = true
 * 2. For each recurring transaction:
 *    - Check if it's older than 1 month
 *    - If yes, check if a similar transaction exists in current month
 *    - If no match, create duplicate with today's date
 */
export async function checkAndCreateRecurringTransactions(
  supabase: SupabaseClient
): Promise<number> {
  try {
    // Get authenticated user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    const userId = userData.user.id;

    // Fetch all recurring transactions
    const { data: recurringTransactions, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_recurring", true);

    if (fetchError) throw fetchError;
    if (!recurringTransactions || recurringTransactions.length === 0) {
      return 0;
    }

    // Get current month's date range
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    // Fetch all transactions from current month
    const { data: currentMonthTransactions, error: currentMonthError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", currentMonthStart.toISOString().split("T")[0])
      .lte("date", currentMonthEnd.toISOString().split("T")[0]);

    if (currentMonthError) throw currentMonthError;

    const transactionsToCreate: Omit<TransactionInsert, "user_id">[] = [];

    // Check each recurring transaction
    for (const recurringTx of recurringTransactions) {
      const txDate = new Date(recurringTx.date);
      const monthsDifference = differenceInMonths(now, txDate);

      // Only process if transaction is at least 1 month old
      if (monthsDifference < 1) {
        continue;
      }

      // Check if a similar transaction exists in current month
      const hasSimilarInCurrentMonth = currentMonthTransactions?.some(
        (tx) =>
          tx.description === recurringTx.description &&
          tx.category === recurringTx.category &&
          tx.amount === recurringTx.amount &&
          tx.type === recurringTx.type
      );

      // If no match found, prepare to create duplicate
      if (!hasSimilarInCurrentMonth) {
        transactionsToCreate.push({
          type: recurringTx.type,
          amount: recurringTx.amount,
          date: now.toISOString().split("T")[0],
          category: recurringTx.category,
          description: recurringTx.description,
          source: recurringTx.source,
          payment_method: recurringTx.payment_method,
          is_recurring: true,
        });
      }
    }

    // Bulk insert new transactions
    if (transactionsToCreate.length > 0) {
      const { error: insertError } = await supabase
        .from("transactions")
        .insert(transactionsToCreate.map((tx) => ({ ...tx, user_id: userId })));

      if (insertError) throw insertError;
    }
    return transactionsToCreate.length;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to process recurring transactions";
    console.error("Recurring transactions error:", message);
    return 0;
  }
}

/**
 * Check if recurring transactions were already processed in the last 30 minutes
 */
export function shouldCheckRecurring(): boolean {
  const lastCheck = localStorage.getItem("gargantua_recurring_last_check");

  if (!lastCheck) {
    return true;
  }

  const lastCheckDate = new Date(lastCheck);
  const now = new Date();
  const thirtyMinutesInMs = 30 * 60 * 1000;

  // Check if it's been 30 minutes since the last check
  return now.getTime() - lastCheckDate.getTime() >= thirtyMinutesInMs;
}

/**
 * Update the last check timestamp
 */
export function updateRecurringCheckTimestamp(): void {
  localStorage.setItem("gargantua_recurring_last_check", new Date().toISOString());
}
