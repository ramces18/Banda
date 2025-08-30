
"use client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Info, ShieldWarning } from "lucide-react";

export default function HomePage() {
  const { bandUser } = useAuth();

  if (!bandUser) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenido, {bandUser.nombreCompleto}</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Info className="h-8 w-8 text-primary" />
            <div>
                <CardTitle>Portal de La Banda del IDI</CardTitle>
                <CardDescription>Un espacio centralizado para nuestra organización.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Este portal ha sido creado para centralizar toda nuestra comunicación, facilitar el acceso a partituras, coordinar nuestros horarios y mejorar la colaboración entre todos los miembros. Es nuestra herramienta para funcionar de manera más unida y eficiente.
          </p>
          <div className="flex items-start gap-4 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <ShieldWarning className="h-6 w-6 text-amber-500 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-400">Aviso de Confidencialidad</h3>
              <p className="text-sm text-amber-400/80">
                La información contenida en este portal es para uso exclusivo de los miembros de la banda. Por favor, no compartas tus credenciales de acceso ni difundas el contenido fuera de este espacio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
