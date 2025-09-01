"use client";

import type { Announcement, BandUser } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface AnnouncementCardProps {
  announcement: Announcement;
  canManage: boolean;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const importanceMap = {
  alta: { label: "Alta", variant: "destructive" as const },
  normal: { label: "Normal", variant: "secondary" as const },
  baja: { label: "Baja", variant: "outline" as const },
};

export function AnnouncementCard({ announcement, canManage, onEdit, onDelete, className }: AnnouncementCardProps) {
  const { id, titulo, contenido, fecha, importancia, autorNombre, imageUrl } = announcement;
  const importanceInfo = importanceMap[importancia] || importanceMap.normal;

  return (
    <Card className={`flex flex-col overflow-hidden ${className}`}>
        {imageUrl && (
            <Link href={`/dashboard/announcements/${id}`} className="block overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={titulo}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                />
            </Link>
        )}
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="hover:text-primary transition-colors">
                 <Link href={`/dashboard/announcements/${id}`}>
                    {titulo}
                </Link>
            </CardTitle>
            <Badge variant={importanceInfo.variant}>{importanceInfo.label}</Badge>
        </div>
        <CardDescription>
          Por {autorNombre || "Desconocido"}
          {fecha && ` - ${format(fecha.toDate(), "d 'de' MMMM 'de' yyyy", { locale: es })}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div 
          className="text-sm text-muted-foreground line-clamp-3"
        >
         {contenido}
        </div>
      </CardContent>
       <CardFooter className="flex justify-end gap-2">
            {canManage && (
            <>
                <Button variant="outline" size="sm" onClick={() => onEdit(announcement)}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
            </>
            )}
            <Button asChild variant="secondary" size="sm">
                <Link href={`/dashboard/announcements/${id}`}>Leer más</Link>
            </Button>
      </CardFooter>
    </Card>
  );
}
