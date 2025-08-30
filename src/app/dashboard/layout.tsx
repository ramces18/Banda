"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, bandUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si ha terminado de cargar y no hay usuario, redirige a la página de inicio
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // Muestra el loader mientras se obtiene la info o si falta el usuario o el bandUser
  if (loading || !user || !bandUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Si todo está correcto, muestra el dashboard
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
