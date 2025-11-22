import { SupabaseClient } from "@supabase/supabase-js";
import { InvestmentSettings, InvestmentSettingsInsert } from "@/types";
import { toast } from "sonner";

/**
 * Service for managing investment settings
 * Provides centralized CRUD operations with auth and error handling
 */
export class InvestmentService {
  constructor(private supabase: SupabaseClient) {}

  private async getUserId(): Promise<string> {
    const { data: userData } = await this.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    return userData.user.id;
  }

  async getInvestmentSettings(): Promise<InvestmentSettings | null> {
    try {
      const userId = await this.getUserId();
      const { data, error } = await this.supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // No rows found
        throw error;
      }
      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch investment settings";
      toast.error(message);
      throw err;
    }
  }

  async updateInvestmentSettings(
    settings: Omit<
      InvestmentSettingsInsert,
      "user_id" | "created_at" | "updated_at"
    >
  ): Promise<InvestmentSettings> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await this.supabase
        .from("investments")
        .upsert({ ...settings, user_id: userId }, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from upsert");

      toast.success("Investment settings saved");
      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save investment settings";
      toast.error(message);
      throw err;
    }
  }
}

/**
 * Create an investment service instance
 */
export function createInvestmentService(supabase: SupabaseClient) {
  return new InvestmentService(supabase);
}
