import { createBrowserClient } from "@supabase/ssr";
import { getSchemaName } from "./helpers";
import { SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      db: { schema: getSchemaName() },
    }
  ) as SupabaseClient;
}
