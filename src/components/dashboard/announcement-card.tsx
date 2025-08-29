"use client";

import type { Announcement } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
  className?: string;
}

const importanceMap = {
  alta: { label: "Alta", variant: "destructive" as const },
  normal: { label: "Normal", variant: "secondary" as const },
  baja: { label: "Baja", variant: "outline" as const },
};

export function AnnouncementCard({ announcement, className }: {announcement: Announcement, className?: string}) {
  const { titulo, contenido, fecha, importancia, autorNombre } = announcement;
  const importanceInfo = importanceMap[importancia] || importanceMap.normal;

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle>{titulo}</CardTitle>
            <Badge variant={importanceInfo.variant}>{importanceInfo.label}</Badge>
        </div>
        <CardDescription>
          Por {autorNombre || "Desconocido"} - {format(fecha.toDate(), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contenido}</p>
      </CardContent>
    </Card>
  );
}
