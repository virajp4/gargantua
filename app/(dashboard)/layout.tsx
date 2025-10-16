import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { checkAuthorization } from "@/lib/supabase/middleware";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const isAuthorized = await checkAuthorization(user.id, user.email || "");
  if (!isAuthorized) {
    redirect("/unauthorized");
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto max-w-7xl py-6 px-4 md:px-6">{children}</main>
    </div>
  );
}
