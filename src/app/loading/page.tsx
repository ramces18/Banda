"use client";

import { Logo } from "@/components/logo";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function LoadingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If auth state is resolved and there's no user, go to login.
    if (!loading && !user) {
      router.replace("/");
      return;
    }
    // If auth state is resolved and there is a user, go to dashboard.
    if (!loading && user) {
      const timer = setTimeout(() => {
         router.replace("/dashboard");
      }, 1500); // Give some time for a better UX
      return () => clearTimeout(timer);
    }
    // If still loading, just wait.
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
      <Logo />
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Cargando dashboard...</p>
      </div>
    </div>
  );
}
