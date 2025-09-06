
"use client";

import type { Announcement } from "@/lib/types";
import { Loader2, ArrowLeft, User, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const importanceMap = {
  alta: { label: "Alta", variant: "destructive" as const },
  normal: { label: "Normal", variant: "secondary" as const },
  baja: { label: "Baja", variant: "outline" as const },
};

interface AnnouncementDetailClientProps {
  announcement: Announcement | null;
}

export function AnnouncementDetailClient({ announcement: initialAnnouncement }: AnnouncementDetailClientProps) {
  const [announcement, setAnnouncement] = useState(initialAnnouncement);
  const [loading, setLoading] = useState(!initialAnnouncement);

  useEffect(() => {
    if (initialAnnouncement) {
      // Convert ISO string back to Date object on the client if it's a string
      const date = typeof initialAnnouncement.fecha === 'string' 
        ? new Date(initialAnnouncement.fecha) 
        : initialAnnouncement.fecha;

      setAnnouncement({
        ...initialAnnouncement,
        fecha: date,
      } as Announcement);
      setLoading(false);
    }
  }, [initialAnnouncement]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Anuncio no encontrado</h2>
        <p className="text-muted-foreground">El anuncio que buscas no existe o ha sido eliminado.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/announcements">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Anuncios y Eventos
          </Link>
        </Button>
      </div>
    );
  }

  const importanceInfo = importanceMap[announcement.importancia] || importanceMap.normal;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
           <Link href="/dashboard/announcements">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Anuncios y Eventos
          </Link>
        </Button>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{announcement.titulo}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
        <div className="flex items-center gap-2">
            <User className="h-4 w-4"/>
            <span>{announcement.autorNombre || "Desconocido"}</span>
        </div>
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4"/>
            <time dateTime={(announcement.fecha as Date).toISOString()}>
                 {format(announcement.fecha as Date, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </time>
        </div>
        <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <Badge variant={importanceInfo.variant}>{importanceInfo.label}</Badge>
        </div>
      </div>
      
      {announcement.imageUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <Image
            src={announcement.imageUrl}
            alt={announcement.titulo}
            fill
            className="object-cover"
          />
        </div>
      )}

      <Card className="shadow-lg">
        <CardContent className="pt-6">
            <div 
                className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap"
             >
                {announcement.contenido}
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
