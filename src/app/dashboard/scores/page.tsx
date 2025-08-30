"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";

export default function ScoresPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partituras</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Partituras</CardTitle>
          <CardDescription>Aquí encontrarás todas las partituras y canciones de la banda.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
              <Music className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold">Próximamente</h2>
              <p className="text-muted-foreground">Esta sección está en construcción. ¡Vuelve pronto!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
