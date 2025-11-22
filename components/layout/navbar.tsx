"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, BarChart3, LogOut, PiggyBank } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="mx-auto max-w-7xl">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Gargantua</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="icon" aria-label="Dashboard">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/investments">
            <Button variant="ghost" size="icon" aria-label="Investments">
              <PiggyBank className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="ghost" size="icon" aria-label="Analytics">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
