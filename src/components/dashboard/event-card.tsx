
"use client";

import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface EventCardProps {
  event: Event;
  canManage: boolean;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function EventCard({ event, canManage, onEdit, onDelete, className }: EventCardProps) {
  const { id, title, description, date, type } = event;

  return (
    <Card className={`flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="hover:text-primary transition-colors">
                 <Link href={`/dashboard/announcements/events/${id}`}>
                    {title}
                </Link>
            </CardTitle>
            <Badge variant="secondary">{type}</Badge>
        </div>
        <CardDescription>
          {format(date.toDate(), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
       <CardFooter className="flex justify-end gap-2">
            {canManage && (
            <>
                <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
            </>
            )}
            <Button asChild size="sm">
                <Link href={`/dashboard/announcements/events/${id}`}>Ver Detalles</Link>
            </Button>
      </CardFooter>
    </Card>
  );
}
