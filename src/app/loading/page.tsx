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
    if (loading) {
      return; // Espera a que termine la carga del estado de autenticación
    }

    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/");
    }
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
