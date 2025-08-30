"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ForumPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Foro de Discusión</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Foro de la Banda</CardTitle>
          <CardDescription>Un espacio para discutir temas, compartir ideas y colaborar.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold">Próximamente</h2>
              <p className="text-muted-foreground">Esta sección está en construcción. ¡Vuelve pronto!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
