"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import type { Event } from "@/lib/types";
import { Loader2, ArrowLeft, Calendar, Info, Tag } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id !== "string") return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
        } else {
          console.error("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Evento no encontrado</h2>
        <p className="text-muted-foreground">El evento que buscas no existe o ha sido eliminado.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/announcements">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Anuncios y Eventos
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
           <Link href="/dashboard/announcements">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Anuncios y Eventos
          </Link>
        </Button>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{event.title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4"/>
            <time dateTime={event.date.toDate().toISOString()}>
                 {format(event.date.toDate(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </time>
        </div>
        <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <Badge variant="secondary">{event.type}</Badge>
        </div>
      </div>
      
      <Card className="shadow-lg">
         <CardContent className="pt-6">
            <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
                {event.description}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
