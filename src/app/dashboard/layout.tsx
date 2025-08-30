
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();

  useEffect(() => {
    // Si ha terminado de cargar y no hay usuario autenticado, redirige a la página de login
    if (!loading && !user) {
      router.replace("/login");
    }
    // Si el usuario está autenticado pero no tiene un documento en la banda
    // (posiblemente durante la creación), no hagas nada y deja que AuthProvider lo maneje.
  }, [user, loading, router]);
  
  // Si está cargando o si el usuario está autenticado pero aún no tenemos el perfil de la banda,
  // muestra un loader. Esto previene mostrar el dashboard incompleto.
  if (loading || (user && !bandUser)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Si no hay usuario y ya no está cargando, no renderices el layout para evitar un flash
  // de contenido antes de la redirección.
  if (!user) {
    return null;
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
