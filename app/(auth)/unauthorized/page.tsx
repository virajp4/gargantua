"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function UnauthorizedPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/gargantua.jpg"
          alt="Gargantua Black Hole"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-300 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight">Access Denied</h1>
            <p className="text-base text-gray-300">
              You are not authorized to access this application
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-gray-300 text-center">
              This is a private personal finance tracker. Only authorized users can access this
              application.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 text-base bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
