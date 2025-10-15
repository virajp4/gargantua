"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } catch {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
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
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-semibold text-white tracking-tight">Gargantua</h1>
          <p className="text-base text-gray-300">Private Personal Finance Tracker</p>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="h-10 text-base bg-white hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <div className="text-black font-normal">
              {loading ? "Signing in..." : "Continue with Google"}
            </div>
          </Button>
          <p className="text-xs text-center text-gray-400">
            This is a private application. Access is restricted to authorized users only.
          </p>
        </div>
      </div>
    </div>
  );
}
