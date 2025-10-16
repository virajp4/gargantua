import { SupabaseClient } from "@supabase/supabase-js";
import { WishlistItem, WishlistInsert, WishlistUpdate } from "@/types";
import { toast } from "sonner";

/**
 * Service for managing wishlist items
 * Provides centralized CRUD operations with auth and error handling
 */
export class WishlistService {
  constructor(private supabase: SupabaseClient) {}

  private async getUserId(): Promise<string> {
    const { data: userData } = await this.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    return userData.user.id;
  }

  async fetchWishlist(): Promise<WishlistItem[]> {
    try {
      const userId = await this.getUserId();
      const { data, error } = await this.supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", userId)
        .order("priority", { ascending: false })
        .order("necessity", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch wishlist";
      toast.error(message);
      throw err;
    }
  }

  async addWishlistItem(
    itemData: Omit<WishlistInsert, "user_id" | "id" | "created_at" | "updated_at">
  ): Promise<WishlistItem> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await this.supabase
        .from("wishlist")
        .insert([{ ...itemData, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from insert");

      toast.success("Item added to wishlist");
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add wishlist item";
      toast.error(message);
      throw err;
    }
  }

  async updateWishlistItem(id: string, updates: WishlistUpdate): Promise<WishlistItem> {
    try {
      const { data, error } = await this.supabase
        .from("wishlist")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from update");

      toast.success("Wishlist item updated");
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update wishlist item";
      toast.error(message);
      throw err;
    }
  }

  async deleteWishlistItem(id: string): Promise<void> {
    try {
      const { error } = await this.supabase.from("wishlist").delete().eq("id", id);

      if (error) throw error;

      toast.success("Wishlist item deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete wishlist item";
      toast.error(message);
      throw err;
    }
  }
}

/**
 * Create a wishlist service instance
 */
export function createWishlistService(supabase: SupabaseClient) {
  return new WishlistService(supabase);
}
