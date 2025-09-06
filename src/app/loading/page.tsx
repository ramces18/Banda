
"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function LoadingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // No hacer nada mientras está cargando
    if (loading) {
      return;
    }

    // Si hay usuario, ir al dashboard, si no, a la página de inicio.
    if (user) {
      router.replace("/dashboard/home");
    } else {
      router.replace("/");
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}
