"use client";

import { Logo } from "@/components/logo";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 6000);

    return () => clearTimeout(timer);
  }, [router]);

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
