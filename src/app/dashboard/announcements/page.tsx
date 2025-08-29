"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Announcement, BandUser } from "@/lib/types";
import { AnnouncementCard } from "@/components/dashboard/announcement-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnnouncementForm } from "@/components/dashboard/announcement-form";

export default function AnnouncementsPage() {
  const { bandUser } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("fecha", "desc"));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      setLoading(true);
      const announcementsData: Announcement[] = [];
      
      const authorPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const announcement: Announcement = { id: docSnapshot.id, ...data } as Announcement;
        
        // Fetch author name
        if (data.autor) {
          const authorDoc = await getDoc(doc(db, "users", data.autor));
          if (authorDoc.exists()) {
            announcement.autorNombre = (authorDoc.data() as BandUser).nombreCompleto;
          }
        }
        return announcement;
      });

      announcementsData.push(...await Promise.all(authorPromises));
      
      setAnnouncements(announcementsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching announcements:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const canManage = useMemo(() => {
    return bandUser?.rol === "lider" || bandUser?.rol === "dirigente";
  }, [bandUser]);
  
  const sortedAnnouncements = useMemo(() => {
    const importanceOrder = { 'alta': 1, 'normal': 2, 'baja': 3 };
    return [...announcements].sort((a, b) => {
      const importanceDiff = importanceOrder[a.importancia] - importanceOrder[b.importancia];
      if (importanceDiff !== 0) return importanceDiff;
      return b.fecha.toMillis() - a.fecha.toMillis();
    });
  }, [announcements]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Anuncios</h1>
        {canManage && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Anuncio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Anuncio</DialogTitle>
              </DialogHeader>
              <AnnouncementForm onFinished={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : announcements.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No hay anuncios publicados todavía.</p>
        </div>
      )}
    </div>
  );
}
