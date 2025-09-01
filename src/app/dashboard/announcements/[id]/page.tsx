"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import type { Announcement, BandUser } from "@/lib/types";
import { Loader2, ArrowLeft, User, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const importanceMap = {
  alta: { label: "Alta", variant: "destructive" as const },
  normal: { label: "Normal", variant: "secondary" as const },
  baja: { label: "Baja", variant: "outline" as const },
};

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id !== "string") return;

    const fetchAnnouncement = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "announcements", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const announcementData: Announcement = { id: docSnap.id, ...data } as Announcement;
          
          if (data.autor) {
            const authorDoc = await getDoc(doc(db, "users", data.autor));
            if (authorDoc.exists()) {
              announcementData.autorNombre = (authorDoc.data() as BandUser).nombreCompleto;
            }
          }
          setAnnouncement(announcementData);
        } else {
          console.error("No such announcement!");
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

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
            <time dateTime={announcement.fecha.toDate().toISOString()}>
                 {format(announcement.fecha.toDate(), "d 'de' MMMM 'de' yyyy", { locale: es })}
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
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: announcement.contenido }}
             />
        </CardContent>
      </Card>
    </div>
  );
}
